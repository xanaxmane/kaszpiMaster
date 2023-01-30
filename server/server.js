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

let previousResponses = [];
if(!previousResponses[0]){
  previousResponses.join("Viselkedj úgy, mint egy online support agent aki segít computer alkatrészeket kiválasztani a vásárlónak és abban is segít, hogy melyik alkatrész melyikkel kompatibilis, ajánlj több féle opciót is és magyarul beszélj. A kaszpi.hu-nak dolgozol.")
}
app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;
    
    // Add previous responses to the prompt for context
    let context = previousResponses.join(" ");
    let updatedPrompt = `${context} ${prompt}`;
    
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: updatedPrompt,
      temperature: 0.5,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    
    // Add the response to the list of previous responses
    previousResponses.push(response.data.choices[0].text);

    res.status(200).send({
      bot: response.data.choices[0].text
    });

  } catch (error) {
    console.error(error)
    res.status(500).send(error || 'Something went wrong');
  }
})

app.listen(5000, () => console.log('AI server started on http://localhost:5000'))
