import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

dotenv.config();

const APP_SECRET = process.env.APP_SECRET

const prisma = new PrismaClient()

const app: Express = express();
const port = process.env.PORT;

app.use(express.json());
app.use((req) => {
  const authHeader = req.headers['authorization']

  if (authHeader) {
    try {
      var decoded = jwt.verify(authHeader, APP_SECRET);
      } catch(err) {
        // err
      }
    }

  const token = 
  process.env.SECRET_KEY  
});

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});


app.post('/initLogin', async (req: Request, res: Response) => {
  const phone = req.body.phoneNumber

  const user = await prisma.user.findUnique({
    select: ''
  })

  if (!user) {
    prisma.user.create({
      data: {
        phone: phone
      }
    })
  }
})

app.post('/confirmLogin', (req: Request, res: Response) => {
  const phone = req.body.phoneNumber
  const code = req.body.code

})

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});