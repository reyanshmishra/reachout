import React, { useCallback, useState, useEffect } from 'react';
import './Popup.css';
const PREVIOUS_MAIL = 'PREVIOUS_MAIL';
import GoogleIcon from './GoogleButton';
import Profile from './Profile';
import { isEmpty } from 'lodash';
import { YOUR_NAME, YOUR_CONTACT_NO, YOUR_INTRODUCTION } from './Constants';

const Popup = () => {
  const [loading, setLoading] = useState(false);
  const [recruiterName, setRecruiterName] = useState('');
  const [company, setCompany] = useState('');
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const [yourName, setYourName] = useState(localStorage.getItem(YOUR_NAME));
  const [yourContactNo, setYourContactNo] = useState(
    localStorage.getItem(YOUR_CONTACT_NO)
  );
  const [yourintroducton, setYourIntroducton] = useState(
    localStorage.getItem(YOUR_INTRODUCTION)
  );
  const fullInformation =
    !isEmpty(yourName) && !isEmpty(yourContactNo) && !isEmpty(yourintroducton);

  useEffect(() => {
    if (!fullInformation) {
      setShowProfile(true);
    }
  }, []);

  useEffect(() => {
    const previousMail = localStorage.getItem(PREVIOUS_MAIL);
    if (previousMail) {
      setLoading(false);
      setEmail(previousMail);
      setError(null);
      return;
    }
  }, []);

  const getTheEmail = async () => {
    setLoading(true);
    setEmail('');
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    var raw = JSON.stringify({
      recruiter_name: recruiterName,
      company: company,
      about_me: yourintroducton,
      job_role: 'Software Engineer',
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    try {
      const response = await fetch(
        'http://localhost:3002/api/user/scrap',
        requestOptions
      );
      const result = await response.json();
      setEmail(result?.answer);
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
        return;
      }
      chrome.tabs.sendMessage(activeTab.id, { message: 'start' }, (detail) => {
        console.log({ detail });
        setRecruiterName(detail?.recruiter);
        setCompany(detail?.company);
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

  return (
    <div className="wrapper">
      <div className="text-container">
        {error && (
          <p className="error-message">
            <span className="material-symbols-outlined error">error</span>
            {error}
          </p>
        )}
        {((showProfile && !error) || !fullInformation) && <Profile />}
        {email.length > 0 && !showProfile && (
          <textarea
            type="text"
            className="text-field"
            id="content"
            value={email}
            onChange={onTextChange}
          />
        )}
        {email.length == 0 && !loading && (
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
          <button
            type="button"
            onClick={getTheEmail}
            className="copy-button generate-button"
          >
            {'Generate'}
          </button>
          <button type="button" onClick={toggleProfile} className="copy-button">
            {!showProfile && fullInformation && (
              <span className="material-symbols-outlined">person</span>
            )}
            {showProfile || !fullInformation ? 'Ok' : 'Profile'}
          </button>
          {email.length > 50 && (
            <button type="button" onClick={handleCopy} className="copy-button">
              <span className="material-symbols-outlined">content_copy</span>
              Copy
            </button>
          )}
        </div>
      )}
      {email.length > 0 && (
        <p className="review-p">
          Review and edit this AI draft to make sure it’s accurate and
          appropriate.
        </p>
      )}
    </div>
  );
};

export default Popup;
