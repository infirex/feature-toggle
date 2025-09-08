import app from './app'
import { AppDataSource } from './helpers/dbHelpers'

const PORT = process.env.PORT || 8000

async function startServer() {
  try {
    await AppDataSource.initialize()
    console.log('Data Source has been initialized!')

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error('Error during Data Source initialization:', err)
    process.exit(1)
  }
}

startServer()
