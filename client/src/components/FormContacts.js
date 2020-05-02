import React, { useState, useContext } from 'react';
import { BasicButtons } from '../components/grommet/button';
import validator from 'validator';
import { useHttp } from '../hook/http.hook';
import { AppContext } from '../context/AppContext';

export const FormContacts = props => {
  const [ form, setForm ] = useState({
    name: '',
    text: ''
  });

  const { toastMessage }  = useContext(AppContext);

  const { loading, request } = useHttp();

  const changeHandler = event => {
    setForm({ ...form, [event.target.name]:event.target.value });
  };

  const submitHandler = async event => {
    try {
      const data  = await request( '/api/contacts/sendForm', 'POST',  {...form});
      toastMessage({
        show: true,
        headerText: "Отправка формы",
        bodyText: data.message
      });
      setForm({ name: "",  text: "" });
    } catch (error) {
      
    }
  };

  const readyToSend = validator.isEmpty(form.name) || validator.isEmpty(form.text);

  return (
    <div className="body__form">
          <input
            type="text"
            placeholder="Ваше имя"
            id="name"
            name="name"
            value={form.name}
            disabled = { loading }
            onChange={changeHandler}
            autoComplete="off"
          />

          <input
            type = "text"
            placeholder = "Ваши контакты (пример: http://vk.com/petrov, doe@mail.com)"
            id = "contacts"
            name = "text"
            value = {form.text}
            disabled = { loading }
            onChange = {changeHandler}
          />
          <BasicButtons
            className = "body__form_send"
            label = "Отправить"
            disabled = { readyToSend || loading }
            onClick = { submitHandler }
            
          />
    </div>
  )
}