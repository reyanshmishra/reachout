import React, { useEffect, useState } from 'react';
import './profile.css';
import {
  YOUR_NAME,
  YOUR_CONTACT_NO,
  YOUR_INTRODUCTION,
  TOKEN,
} from './Constants';
import { isEmpty } from 'lodash';
const IS_VALID = { VALID: 'VALID', INVALID: 'INVALID', REQUIRED: null };

const Profile = ({ handleOk }) => {
  const [name, setName] = useState(localStorage.getItem(YOUR_NAME) || '');
  const [contact, setContact] = useState(
    localStorage.getItem(YOUR_CONTACT_NO) || ''
  );
  const [token, setToken] = useState(localStorage.getItem(TOKEN) || '');
  const [about, setAbout] = useState(
    localStorage.getItem(YOUR_INTRODUCTION) || ''
  );
  const [invalidToken, setInvalidToken] = useState(IS_VALID.REQUIRED);

  const isValid = !isEmpty(name) && !isEmpty(contact) && !isEmpty(about);

  useEffect(() => {
    const validate = async () => {
      try {
        setInvalidToken(IS_VALID.REQUIRED);
        var myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', `Bearer ${token}`);
        var raw = JSON.stringify({
          model: 'gpt-3.5-turbo',
          max_tokens: 180,
          n: 1,
          messages: [{ role: 'system', content: 'Test' }],
          stop: null,
          temperature: 1,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
        });

        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow',
        };
        const url = 'https://api.openai.com/v1/chat/completions';
        const response = await fetch(url, requestOptions);
        if (response.status == 200) {
          localStorage.setItem(TOKEN, token);
          setInvalidToken(IS_VALID.VALID);
        } else {
          setInvalidToken(IS_VALID.INVALID);
        }
      } catch (error) {
        setInvalidToken(IS_VALID.INVALID);
      }
    };

    validate();
  }, [token]);

  const [emailAddress, setEmailAddress] = useState(
    localStorage.getItem(YOUR_INTRODUCTION)
  );

  const handleNameChange = (event) => {
    setName(event.target.value);
    localStorage.setItem(YOUR_NAME, event.target.value);
  };

  const handleContactChange = (event) => {
    setContact(event.target.value);
    localStorage.setItem(YOUR_CONTACT_NO, event.target.value);
  };
  const onTokenChange = async (event) => {
    setToken(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmailAddress(event.target.value);
    // localStorage.setItem(YOUR_INTRODUCTION, event.target.value);
  };

  const handleAboutChange = (event) => {
    setAbout(event.target.value);
    localStorage.setItem(YOUR_INTRODUCTION, event.target.value);
  };

  return (
    <>
      <p className="review-p" style={{ marginTop: 10 }}>
        Please enter all the details to start drafting the emails.
      </p>
      <form className="input-form">
        <input
          type="text"
          className="your_name"
          placeholder="Enter your name"
          required
          value={name}
          onChange={handleNameChange}
        />

        <input
          className="your_name"
          placeholder="Enter your contact number"
          required
          type="tel"
          value={contact}
          onChange={handleContactChange}
        />

        <input
          className="your_name"
          placeholder="Enter your open AI token"
          required
          type="tel"
          value={token}
          onChange={onTokenChange}
        />

        <textarea
          className="about_me"
          placeholder={`Compose a concise self-introduction paragraph, limited to 450 characters, inspired by the provided example.\n\nMy name is Jonh Doe. I have 5 years of experience in Javascript and Android development. I have worked on various technologies like docker, python, linux shell script.\n`}
          required
          value={about}
          onChange={handleAboutChange}
        />
      </form>
      <div className="ok-wrapper">
        {invalidToken == IS_VALID.INVALID && (
          <p className="error">Token is invalid or empty.</p>
        )}
        {invalidToken == IS_VALID.VALID && (
          <button
            type="button"
            disabled={!isValid}
            onClick={handleOk}
            className="copy-button ok-button"
          >
            Ok
          </button>
        )}
        {invalidToken == IS_VALID.REQUIRED && (
          <div className="loader loader-sty"></div>
        )}
      </div>
    </>
  );
};

export default Profile;
