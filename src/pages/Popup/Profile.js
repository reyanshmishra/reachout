import React, { useState } from 'react';
import './profile.css';
import { YOUR_NAME, YOUR_CONTACT_NO, YOUR_INTRODUCTION } from './Constants';
import { isEmpty } from 'lodash';

const Profile = ({ handleOk }) => {
  const [name, setName] = useState(localStorage.getItem(YOUR_NAME) || '');
  const [contact, setContact] = useState(
    localStorage.getItem(YOUR_CONTACT_NO) || ''
  );
  const [about, setAbout] = useState(
    localStorage.getItem(YOUR_INTRODUCTION) || ''
  );

  const isValid = !isEmpty(name) && !isEmpty(contact) && !isEmpty(about);

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

        {/* <input
        type="text"
        className="name"
        id="email_address"
        name="email_address"
        placeholder="Enter your email address"
        required
        value={emailAddress}
        onChange={handleEmailChange}
      /> */}

        <textarea
          className="about_me"
          placeholder={`Compose a concise self-introduction paragraph, limited to 450 characters, inspired by the provided example.\n\nMy name is Jonh Doe. I have 5 years of experience in Javascript and Android development. I have worked on various technologies like docker, python, linux shell script.\n`}
          required
          value={about}
          onChange={handleAboutChange}
        />
      </form>
      <button
        type="button"
        disabled={!isValid}
        onClick={handleOk}
        className="copy-button ok-button"
      >
        Ok
      </button>
    </>
  );
};

export default Profile;
