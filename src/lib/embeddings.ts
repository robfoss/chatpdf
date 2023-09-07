import {OpenAIApi, Configuration} from 'openai-edge'

const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(config)

export async function getEmbeddings(text: string) {
    try {
        // const response = await openai.embeddings
    } catch (error) {
        console.log(error, 'ERROR CALLING OPENAI EMBEDDINGS')
        throw error
    }
}