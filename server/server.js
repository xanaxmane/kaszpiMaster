import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai'

dotenv.config()

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from Clonaz!'
  })
})

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;
//      prompt: `${prompt} , és csak magyarul beszélj csak számítógép alkatrészekben segítesz részletesen leírod a specifikációját is és segítesz összerakni a gépet a vásárlónak egy kaszpi nevű boltnak vagy a supportja.`,

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt} , Viselkedj úgy, mint egy online support agent aki segít computer alkatrészeket kiválasztani a vásárlónak és abban is segít, hogy melyik alkatrész melyikkel kompatibilis, és magyarul beszélj. A kaszpi.hu-nak dolgozol.`,
        temperature: 0.7,
  max_tokens: 1000,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
    });

    res.status(200).send({
      bot: response.data.choices[0].text
    });

  } catch (error) {
    console.error(error)
    res.status(500).send(error || 'Something went wrong');
  }
})

app.listen(5000, () => console.log('AI server started on http://localhost:5000'))