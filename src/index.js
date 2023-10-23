import express from "express";
import ProductRouter from "./router/product.routes.js";
import CartRouter from "./router/carts.routes.js";
import ProductManager from "./controllers/ProductManager.js";
import CartManager from "./controllers/CartManager.js";
import mongoose from "mongoose";
import {engine} from "express-handlebars"
import * as path from "path"
import __dirname from "./utils.js"
import userRouter from "./router/user.routes.js";
import MongoStore from "connect-mongo"
import session from 'express-session'
import sessionFileStore from "session-file-store"; // Importa la biblioteca completa

const FileStore = sessionFileStore(session); 
const product = new ProductManager();
const cart = new CartManager();


const app = express()
const PORT = 8080

app.use(express.json() )
app.use(express.urlencoded({extended: true}));



app.listen(PORT, () => {
    console.log(`Servidor Express Puerto ${PORT}`)
})


//mongoose usuario y contraseña //

mongoose.connect("mongodb+srv://leiderasis30:M2UCwmWsQlIGwGKC@cluster0.f7btw4v.mongodb.net/?retryWrites=true&w=majority")
.then (()=>{
    console.log("Conectado")
})

.catch(error =>{
    console.error("Error al conectarse a la BD " + error)
})


app.use(session({
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://shirleytique911:GKZraArQ50QuepXc@cluster0.dvtsniz.mongodb.net/?retryWrites=true&w=majority",
        mongoOptions : {useNewUrlParser: true , useUnifiedTopology: true}, ttl:4000
    }),
    secret:"claveSecreta",
    resave: false,
    saveUninitialized:false,
}))

app.use("/api/products", ProductRouter)
app.use("/api/cart", CartRouter)
app.use("/api/sessions", userRouter)


//Handlebars//

app.engine('hbs', engine({ allowProtoPropertiesByDefault: true }));


app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname + "/views"))
app.use("/", express.static(__dirname + "/public"));



app.get("/products", async (req, res) => {
    if(!req.session.emailUsuario){
        return res.redirect("/login")
    }
    let allProducts = await product.getProducts();
    const products = allProducts.map(product => product.toJSON());
    res.render("viewProducts", {
        title: "vista productos",
        products: products,
        email: req.session.emailUsuario,
        rol: req.session.rolUsuario,

    });
});

//renderizado de productos en carrito

app.get("/carts/:cid", async (req, res) => {
    let id = req.params.cid
    let allCarts  = await cart.getCartWithProducts(id)
    res.render("viewCart", {
        title: "vista carro",
        carts : allCarts
    });
});

//aqui podemos ingresar al login atravez de la ruta http://localhost:8080/login
app.get("/login", async (req, res)=>{
    res.render("login",{
        title:"Vista Login",
    });
})
//aqui con la ruta http://localhost:8080/register
app.get("/register", async (req, res)=>{
    res.render("register",{
        title:"Vista register",
    });
})
//aqui con la ruta http://localhost:8080/profile
app.get("/profile", async (req, res)=>{
    if(!req.session.emailUsuario){
        return res.redirect("/login")
    }
    res.render("profile",{
        title:"Vista profile Admin",
        first_name:req.session.nomUsuario,
        last_name: req.session.apeUsuario,
        email: req.session.emailUsuario,
        rol: req.session.rolUsuario,
    });
})