import { Client, Databases, Account } from 'appwrite'
import { API_URL, PROJECT_ID } from './variables'

const client = new Client().setEndpoint(API_URL).setProject(PROJECT_ID)

export const databases = new Databases(client)
export const account = new Account(client)

export default client
