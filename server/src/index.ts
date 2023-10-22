import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

dotenv.config();

const APP_SECRET: string = process.env.APP_SECRET!

const prisma = new PrismaClient()

const app: Express = express();
const port = process.env.PORT;

// Creates a random sequence of characters
const createRandomCode = () => {
  const chars = '0123456789'
  let result = ''
  for (let i = 0; i < 8; i++) result += chars[Math.floor(Math.random() * chars.length)]
  return result
}

interface AuthenticatedRequest extends Request {
  user: {
    id: string
  }
}

app.use(express.json());


app.use((req, res, next) => {
  const authHeader = req.headers['authorization']

  if (authHeader) {
    try {
      var decoded = jwt.verify(authHeader, APP_SECRET);
      console.log(decoded)
    } catch(err) {
        // err
    }
  }

  return next()
});

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

const validatePhoneNumber = (phoneNumber?: string) => {
  if (!phoneNumber) {
    return false
  }

  if (typeof phoneNumber !== 'string') {
    return false
  }

  if (phoneNumber.length !== 11) {
    return false
  }

  if (!parseInt(phoneNumber)) {
    return false
  }

  return true
}

const validateLoginCode = (code?: string) => {
  if (!code) {
    return false
  }

  if (typeof code !== 'string') {
    return false
  }

  if (code.length !== 8) {
    return false
  }

  if (!parseInt(code)) {
    return false
  }

  return true
}

app.get('/confirmLogin', async (req: Request, res: Response) => {
  const phone = req.query.phoneNumber as string
  const code = req.query.code as string

  if (!validatePhoneNumber(phone)) {
    res.status(400).send('Invalid phone number')
    return 
  } else if (!validateLoginCode(code)) {
    res.status(400).send('Invalid code')
    return
  }

  const user = await prisma.user.findUnique({
    where: {
      phone: parseInt(phone)
    }
  })

  if (!user) {
    res.status(400).send('User not found')
  } else {
    if (user.loginCode === code) {
      await prisma.user.update({
        where: {
          phone: parseInt(phone)
        },
        data: {
          verified: true
        }
      })

      res.status(200).send('Success')
    } else {
      res.status(400).send('Incorrect code')
    }
  } 
})

app.post('/initLogin', async (req: Request, res: Response) => {
  const phone = req.body.phoneNumber

  const user = await prisma.user.findUnique({
    where: {
      phone
    }
  })

  if (!user) {
    await prisma.user.create({
      data: {
        phone: phone,
        loginCode: createRandomCode(),
        verified: false
      }
    })
  } else {

  }
})

app.post('/confirmLogin', (req: Request, res: Response) => {
  const phone = req.body.phoneNumber
  const code = req.body.code

})

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});