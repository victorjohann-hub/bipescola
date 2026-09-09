async function createParent(req, res) {
  try {
    const { name, email } = req.body;

    const result = await UserService.createParent({
      name,
      email
    });

    return res.status(201).json({
      message: 'Conta criada',
      tempPassword: result.tempPassword
    });

  } catch (error) {
    return res.status(400).json({
      error: error.message
    });
  }
}