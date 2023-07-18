import { useState, useEffect } from 'react';
const PREVIOUS_MAIL = 'previousMail';

const useDraftEmail = (name, company) => {
  const [loading, setLoading] = useState(false);
  const [emailDraft, setEmailDraft] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getTheEmail = async () => {
      const previousMail = localStorage.getItem(PREVIOUS_MAIL);

      if (previousMail) {
        setLoading(false);
        setEmail(previousMail);
        setError(null);
        return;
      }

      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');

      var raw = JSON.stringify({
        recruiter_name: name,
        company: company,
        about_me:
          'My name is Reyansh Mishra. I have 5 years of experience in Javascript and Android development add signature to the mail my name is Reyansh Mishra and my contact number is 937 939 0268',
        job_role: 'Senior Software Engineer',
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
        setEmailDraft(result?.answer);
        setError(null);
        localStorage.setItem(PREVIOUS_MAIL, result?.answer);
      } catch (error) {
        setError('Something went wrong.');
      }
      setLoading(false);
    };

    if (!loading && !emailDraft && name) {
      setLoading(true);
      getTheEmail();
    }
  }, [loading, name, company, emailDraft]);

  return { loading, emailDraft, error };
};

export default useDraftEmail;
