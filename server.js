import express, { request } from 'express'
import { PrismaClient } from '@prisma/client'
import cors from 'cors'

const prisma = new PrismaClient()


const app = express();
app.use(express.json());
app.use(cors())

import validator from 'validator';


app.post('/user', async (req, res) => {
    const { email, name, age } = req.body;

    // Validações
    if (!email || !validator.isEmail(email)) {
        return res.status(400).json({ error: 'Formato de e-mail inválido' });
    }
    if (!name || typeof name !== 'string') {
        return res.status(400).json({ error: 'Nome inválido' });
    }
    if (typeof age !== 'number' || age < 0) {
        return res.status(400).json({ error: 'Idade inválida' });
    }

    try {
        const user = await prisma.user.create({
            data: { email, name, age }
        });
        res.status(201).json(user);
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        res.status(500).json({ error: 'Erro ao criar usuário' });
    }
});


app.get('/user', async (req, res) => {

    let users = []

    if (req.query) {
        users = await prisma.user.findMany({
            where: {
                name: req.query.name,
                email: req.query.email,
                age: req.query.age
            }
        })

    } else {
        users = await prisma.user.findMany()
    }


    res.status(200).json(users)
})

app.put('/user/:id', async (req, res) => {

    await prisma.user.update({
        where: {
            id: req.params.id
        },

        data: {
            email: req.body.email,
            name: req.body.name,
            age: req.body.age
        }
    })

    res.status(201).json(req.body);
})

app.delete('/user/:id', async (req, res) => {
    await prisma.user.delete({
        where: {
            id: req.params.id
        }
    })

    res.status(200).json({ message: "Usuario deletado com sucesso" });

})

app.listen(3000)

//1) tipo de rota / Metodo HTTP
//2) Endereço
