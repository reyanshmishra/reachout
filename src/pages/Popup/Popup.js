import React, { useCallback, useState, useEffect } from 'react';
import './Popup.css';
const PREVIOUS_MAIL = 'PREVIOUS_MAIL';
import GoogleIcon from './GoogleButton';
import Profile from './Profile';
import { isEmpty } from 'lodash';
import {
  YOUR_NAME,
  YOUR_CONTACT_NO,
  YOUR_INTRODUCTION,
  TOKEN,
} from './Constants';

const Popup = () => {
  const [loading, setLoading] = useState(true);
  const [recruiterName, setRecruiterName] = useState('');
  const [company, setCompany] = useState('');
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const [yourName, setYourName] = useState('');
  const [yourContactNo, setYourContactNo] = useState('');
  const [yourintroducton, setYourIntroducton] = useState('');
  const [token, setToken] = useState('');
  const fullInformation =
    (!isEmpty(yourName) &&
      !isEmpty(yourContactNo) &&
      !isEmpty(yourintroducton) &&
      !isEmpty(token)) ||
    false;

  useEffect(() => {
    const yname = localStorage.getItem(YOUR_NAME) || '';
    const ycontactNo = localStorage.getItem(YOUR_CONTACT_NO) || '';
    const yIntro = localStorage.getItem(YOUR_INTRODUCTION) || '';
    const token = localStorage.getItem(TOKEN) || '';
    setToken(token);
    setYourName(yname);
    setYourContactNo(ycontactNo);
    setYourIntroducton(yIntro);
  }, []);

  useEffect(() => {
    if (!fullInformation) {
      // setShowProfile(true);
    }
  }, []);

  const getTheEmail = async () => {
    setLoading(true);
    setEmail('');
    var myHeaders = new Headers();
    let token = localStorage.getItem(TOKEN);
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', `Bearer ${token}`);

    let content =
      'Write mail to a recruiter using the given details: ' +
      "\nRecruiter's name is " +
      recruiterName +
      '\n he is hiring for ' +
      company +
      '\n\nMy Resume details: \n' +
      yourintroducton +
      '\n Please make it as concise as you can and limit it to 100-110 words.';
    var raw = JSON.stringify({
      model: 'gpt-3.5-turbo',
      max_tokens: 180,
      n: 1,
      messages: [{ role: 'system', content: content }],
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

    try {
      const url = 'https://api.openai.com/v1/chat/completions';
      const response = await fetch(url, requestOptions);
      const result = await response.json();
      setEmail(result?.choices?.[0]?.message?.content);
      setError(null);
      localStorage.setItem(PREVIOUS_MAIL, result?.answer);
    } catch (error) {
      setError('Something went wrong.');
    }
    setLoading(false);
  };

  useEffect(() => {
    chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
      var activeTab = tabs[0];
      if (!activeTab?.url?.startsWith('https://www.linkedin.com/in')) {
        setError(
          'No profile found.\nPlease make sure you are on recruiters profile.'
        );
        setLoading(false);
        return;
      }
      chrome.tabs.sendMessage(activeTab.id, { message: 'start' }, (detail) => {
        setRecruiterName(detail?.recruiter);
        setCompany(detail?.company);
        setLoading(false);
      });
    });
  }, []);

  const handleCopy = useCallback(() => {
    var copyText = document.getElementById('content');
    copyText.select();
    navigator.clipboard.writeText(copyText.value);
  }, []);

  const onTextChange = useCallback((value) => {
    setEmail(value.target.value);
  }, []);

  const toggleProfile = useCallback(() => {
    setYourContactNo(localStorage.getItem(YOUR_CONTACT_NO));
    setYourName(localStorage.getItem(YOUR_NAME));
    setYourIntroducton(localStorage.getItem(YOUR_INTRODUCTION));
    setShowProfile((old) => !old);
  }, [fullInformation]);

  const handleOk = useCallback(() => {
    const yname = localStorage.getItem(YOUR_NAME) || '';
    const ycontactNo = localStorage.getItem(YOUR_CONTACT_NO) || '';
    const yIntro = localStorage.getItem(YOUR_INTRODUCTION) || '';
    setYourName(yname);
    setYourContactNo(ycontactNo);
    setYourIntroducton(yIntro);
    setShowProfile(false);
  }, []);

  if (error) {
    return (
      <div>
        <p className="error-message">
          <span className="material-symbols-outlined error">‼️</span>
          {error}
        </p>
        <a
          className="made_by"
          href="https://www.linkedin.com/in/reyanshmishra"
          target="_blank"
        >
          Please Hire Reyansh Mishra ❤️
        </a>
      </div>
    );
  }

  if (!fullInformation || showProfile) {
    return <Profile handleOk={handleOk} />;
  }

  return (
    <>
      <div className="text-container">
        {!isEmpty(email) && !showProfile && (
          <textarea
            type="text"
            className="text-field"
            id="content"
            value={email}
            onChange={onTextChange}
          />
        )}
        {!isEmpty(email) == 0 && !loading && (
          <div className="generate-wrapper">
            <p className="generate_label">{`Please click on draft to create a personalized email to send to ${recruiterName}`}</p>
          </div>
        )}
      </div>
      {loading && (
        <div className="loader-wrapper">
          <div className="loader"></div>
          <p>Please wait, drafting an email for you.</p>
        </div>
      )}
      {!error && (
        <div className="buttons-wrapper">
          {/* <GoogleIcon /> */}
          {!loading && (
            <>
              {/* <button
                type="button"
                onClick={getTheEmail}
                disabled={loading}
                className="copy-button generate-button"
              >
                👨🏼‍🍳 Ask for Referral
              </button> */}
              <button
                type="button"
                onClick={getTheEmail}
                disabled={loading}
                className="copy-button generate-button"
              >
                👨🏼‍🍳 Draft
              </button>
            </>
          )}
          <button type="button" onClick={toggleProfile} className="copy-button">
            👨🏼‍💻 Profile
          </button>
          {!isEmpty(email) && (
            <button type="button" onClick={handleCopy} className="copy-button">
              <span className="material-symbols-outlined">content_copy</span>
              Copy
            </button>
          )}
        </div>
      )}
      {!isEmpty(email) > 0 && (
        <p className="review-p">
          Review and edit this AI draft to make sure it’s accurate and
          appropriate.
        </p>
      )}
    </>
  );
};

export default Popup;
