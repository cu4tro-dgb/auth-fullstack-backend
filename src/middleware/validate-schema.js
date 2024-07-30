export function validateSchema(schema) {
  return async (req, res, next) => {
    try {
      schema.parse(req.body)
      next()
    } catch (error) {
      console.error(error)
      res.status(400).json({ errors: error.errors })
    }
  }
}
