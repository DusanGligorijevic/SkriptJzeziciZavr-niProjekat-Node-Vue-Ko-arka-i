const express = require('express');
const Joi = require('joi');
const mysql = require('mysql');

const pool =mysql.createPool({
        connectionLimit: 100,
        host:'localhost',
        user:'root',
        password:'',
        database:'schema'
});
const rtr = express.Router();


const sema = Joi.object().keys({
    idKosarkasi:Joi.number().required(),
    broj: Joi.number().min(0).max(99).required(),
    godine:Joi.number().min(16).max(45).required(),
    idKlub: Joi.number().required(),
    imeIPrezime:Joi.string().trim().min(2).max(30).required()
});

const sema2 = Joi.object().keys({
    idKosarkasi:Joi.number().required()
})
rtr.use(express.json());

rtr.get('/kosarkasi', (req, res) =>{
    pool.query('select * from kosarkasi', (err, rows) =>{
        if(err)
            res.status(500).send(err.sqlMessage);
        else
            res.send(rows);
    });

});

// Cuvanje novog kosarkasa (vraca korisniku ceo red iz baze)
rtr.post('/kosarkasi', (req, res) => {
    // Validiramo podatke koje smo dobili od korisnika
    let { error } = sema.validate(req.body);  // Object decomposition - dohvatamo samo gresku

    // Ako su podaci neispravni prijavimo gresku
    if (error)
        res.status(400).send(error.details[0].message);// Greska zahteva
    else {  // Ako nisu upisemo ih u bazu
        // Izgradimo SQL query string

        let query = "insert into schema.Kosarkasi (idKosarkasi, broj, godine, idKlub, imeIPrezime) values (?, ?, ?, ?, ?)";
        let formated = mysql.format(query, [req.body.idKosarkasi, req.body.broj,
            req.body.godine, req.body.idKlub, req.body.imeIPrezime]);


        // Izvrsimo query
        pool.query(formated, (err, response) => {
            if (err)
                res.status(500).send(err.sqlMessage);
            else {
                // Ako nema greske dohvatimo kreirani objekat iz baze i posaljemo ga korisniku
                query = 'select * from Kosarkasi where idKosarkasi=?';
                formated = mysql.format(query, [response.insertId]);


                pool.query(formated, (err, rows) => {
                    if (err)
                        res.status(500).send(err.sqlMessage);
                    else
                        res.send(rows[0]);
                });
            }
        });
    }
});

// Prikaz kosarkasa
rtr.get('/kosarkasi/:idKosarkasi', (req, res) => {
    let query = 'select * from kosarkasi where idKosarkasi=?';
    let formated = mysql.format(query, [req.params.idKosarkasi]);

    pool.query(formated, (err, rows) => {
        if (err)
            res.status(500).send(err.sqlMessage);
        else
            res.send(rows[0]);
    });
});


// Izmena kosarkasa (menja idKosarkasa)
rtr.put('/kosarkasi/:idKosarkasi', (req, res) => {
    let { error } = sema2.validate(req.body);

    if (error)
        res.status(400).send(error.details[0].message);
    else {
        let query = "update kosarkasi set idKosarkasi=? where idKosarkasi=?";
        let formated = mysql.format(query, [req.body.idKosarkasi,req.params.idKosarkasi]);

        pool.query(formated, (err, response) => {
            if (err)
                res.status(500).send(err.sqlMessage);
            else {
                query = 'select * from kosarkasi where idKosarkasi=?';
                formated = mysql.format(query, [req.params.idKosarkasi]);

                pool.query(formated, (err, rows) => {
                    if (err)
                        res.status(500).send(err.sqlMessage);
                    else
                        res.send(rows[0]);
                });
            }
        });
    }

});

// Brisanje kosarkasa (vraca korisniku ceo red iz baze)
rtr.delete('/kosarkasi/:idKosarkasi', (req, res) => {
    let query = 'select * from kosarkasi where idKosarkasi=?';
    let formated = mysql.format(query, [req.params.idKosarkasi]);

    pool.query(formated, (err, rows) => {
        if (err)
            res.status(500).send(err.sqlMessage);
        else {
            let kosarkas = rows[0];

            let query = 'delete from kosarkasi where idKosarkasi=?';
            let formated = mysql.format(query, [req.params.idKosarkasi]);

            pool.query(formated, (err, rows) => {
                if (err)
                    res.status(500).send(err.sqlMessage);
                else
                    res.send(kosarkas);
            });
        }
    });
});

// za tabelu klubovi---------------------------------------

const schemaklub = Joi.object().keys({
    idKlubovi: Joi.number().required(),
    Grad: Joi.string().max(30),
    Ime: Joi.string().max(30),
    brojTitula: Joi.number().min(0)
})
const schemaklub2 = Joi.object().keys({
    brojTitula: Joi.number().min(0)
})
 //prikaz svih klubova u bazi
rtr.get('/klubovi', (req, res) =>{
    pool.query('select * from klubovi', (err, rows) =>{
        if(err)
            res.status(500).send(err.sqlMessage);
        else
            res.send(rows);
    });

});

// Cuvanje novog kluba (vraca korisniku ceo red iz baze)
rtr.post('/klubovi', (req, res) => {
    // Validiramo podatke koje smo dobili od korisnika
    let { error } = schemaklub.validate(req.body);  // Object decomposition - dohvatamo samo gresku

    // Ako su podaci neispravni prijavimo gresku
    if (error)
        res.status(400).send(error.details[0].message);// Greska zahteva
    else {  // Ako nisu upisemo ih u bazu
        // Izgradimo SQL query string

        let query = "insert into schema.klubovi (idKlubovi, Grad, Ime, brojTitula) values (?, ?, ?, ?)";
        let formated = mysql.format(query, [req.body.idKlubovi, req.body.Grad,
            req.body.Ime, req.body.brojTitula]);


        // Izvrsimo query
        pool.query(formated, (err, response) => {
            if (err)
                res.status(500).send(err.sqlMessage);
            else {
                // Ako nema greske dohvatimo kreirani objekat iz baze i posaljemo ga korisniku
                query = 'select * from klubovi where idKlubovi=?';
                formated = mysql.format(query, [response.insertId]);


                pool.query(formated, (err, rows) => {
                    if (err)
                        res.status(500).send(err.sqlMessage);
                    else
                        res.send(rows[0]);
                });
            }
        });
    }
});

// Prikaz pojedinacnog kluba
rtr.get('/klubovi/:idKlubovi', (req, res) => {
    let query = 'select * from klubovi where idKlubovi=?';
    let formated = mysql.format(query, [req.params.idKlubovi]);

    pool.query(formated, (err, rows) => {
        if (err)
            res.status(500).send(err.sqlMessage);
        else
            res.send(rows[0]);
    });
});


// Izmena kluba (menja brojTitula kluba)
rtr.put('/klubovi/:idKlubovi', (req, res) => {
    let { error } = schemaklub2.validate(req.body);

    if (error)
        res.status(400).send(error.details[0].message);
    else {
        let query = "update klubovi set brojTitula=? where idKlubovi=?";
        let formated = mysql.format(query, [req.body.brojTitula,req.params.idKlubovi]);

        pool.query(formated, (err, response) => {
            if (err)
                res.status(500).send(err.sqlMessage);
            else {
                query = 'select * from klubovi where idKlubovi=?';
                formated = mysql.format(query, [req.params.idKlubovi]);

                pool.query(formated, (err, rows) => {
                    if (err)
                        res.status(500).send(err.sqlMessage);
                    else
                        res.send(rows[0]);
                });
            }
        });
    }

});

// Brisanje kluba (vraca korisniku ceo red iz baze)
rtr.delete('/klubovi/:idKlubovi', (req, res) => {
    let query = 'select * from klubovi where idKlubovi=?';
    let formated = mysql.format(query, [req.params.idKlubovi]);

    pool.query(formated, (err, rows) => {
        if (err)
            res.status(500).send(err.sqlMessage);
        else {
            let klub = rows[0];

            let query = 'delete from klubovi where idKlubovi=?';
            let formated = mysql.format(query, [req.params.idKlubovi]);

            pool.query(formated, (err, rows) => {
                if (err)
                    res.status(500).send(err.sqlMessage);
                else
                    res.send(klub);
            });
        }
    });
});

//deo za user tabelu--------------------------
const schemauser = Joi.object().keys({
    username: Joi.string().trim().min(1).max(16).required().alphanum(),
    password: Joi.string().min(1).max(25).required()
})

module.exports=rtr;