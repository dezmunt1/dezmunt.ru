const { Router } = require('express');
const axios = require('axios');
const config = require('config');

const router = Router();

router.post( '/sendForm', async (req, res) => {
  try {

    if ( !req.body ) {
      return res.status(401).json({ message: "", errors: "В форме нет данных" });
    }
    console.log(req.body);

    const message  = `Сообщение от ${req.body.name}:\n[Текст сообщения]: ${req.body.text}`

    await axios({
      method: 'POST',
      url: `${ config.get("TELEGRAM_URL") }/sendMessage`,
      data: {
        chat_id: config.get("TELEGRAM_USER"),
        text: message
      }
    });
    return res.status(200).json({ message: "Данные успешно отправлены", errors: "" });

  } catch (error) {
    console.log(error.message)
  };
});

module.exports = router;