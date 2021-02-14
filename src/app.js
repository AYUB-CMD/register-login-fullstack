const express = require('express');
const path = require('path');
const app = express();
const hbs = require('hbs')
const bcrypt = require('bcryptjs');
const port = process.env.PORT || 3000;
require('./db/conn');
const LegalUser = require('./model/model');

const { json } = require('express');

const static_path = path.join(__dirname, "../public")

app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(express.static(static_path))//for static
const temp_path = path.join(__dirname, "../templates/views")
const partials_path =path.join(__dirname,"../templates/partials")
//seting view
app.set('view engine', 'hbs')
app.set('views', temp_path)//for templates
hbs.registerPartials(partials_path)//for partials

app.get('/', (req, res) => {
    res.render('index')
})
app.get('/login', (req, res) => {
    res.render('login')
})
app.get('/register', (req, res) => {
    res.render('register')
})
app.post('/register', async (req, res) => {
    try {
        const user = LegalUser({
            name: req.body.name,
            email: req.body.email,
            password: req.body.pass,
            cpassword: req.body.re_pass
        });
        const register = await user.save();
        res.status(200).render('index');
    } catch (e) {
        res.status(400).send(e)
    }
});
app.post('/login', async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const userEmail = await LegalUser.findOne({ email: email });
        //to read the data 
        //console.log(`${email} ${password}`)

        if (userEmail.password === password) {
            res.status(200).render('index')
        }
        else {
            res.send('invalid login details');
        }
    }
    catch (e) {
        res.send('invalid login details')
    }
})


app.listen(port, () => {
    console.log(`running on port number : ${port}`)
})
