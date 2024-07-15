import { useState, useEffect, useCallback, useMemo } from "react";
import { Container, Row, Col } from "react-bootstrap";
import headerImg from "../../assets/svg/5CPhLg01.svg";
import { ArrowLeftCircle } from 'react-bootstrap-icons';
import 'animate.css';
import './Home.css';
import { NavLink } from "react-router-dom";
import TrackVisibility from 'react-on-screen';

export const Home = () => {
  const [loopNum, setLoopNum] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, setText] = useState('');
  const [delta, setDelta] = useState(200); // Fixed speed to 2 seconds
  const period = 5000; // Period between full text display and start of deletion

  const toRotate = useMemo(() => ["תודה שבאתם אלינו", "מטרת האתר לעזור לאנשים", "שמח לראות אותכם"], []);

  const tick = useCallback(() => {
    const i = loopNum % toRotate.length;
    const fullText = toRotate[i];
    const updatedText = isDeleting ? fullText.substring(0, text.length - 1) : fullText.substring(0, text.length + 1);

    setText(updatedText);

    if (isDeleting) {
      setDelta(100); // Speed up deletion
    }

    if (!isDeleting && updatedText === fullText) {
      setIsDeleting(true);
      setDelta(period);
    } else if (isDeleting && updatedText === '') {
      setIsDeleting(false);
      setLoopNum(loopNum + 1);
      setDelta(200); // Reset speed for new text
    }
  }, [isDeleting, loopNum, text.length, toRotate, period]);

  useEffect(() => {
    const ticker = setInterval(() => {
      tick();
    }, delta);

    return () => clearInterval(ticker);
  }, [tick, delta]);

  useEffect(() => {
    addBootstrap();
    return removeBootstrap;
  }, []);

  const addBootstrap = () => {
    const link = document.createElement('link');
    link.href = 'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css';
    link.rel = 'stylesheet';
    link.id = 'bootstrap-css';
    document.head.appendChild(link);
  };

  const removeBootstrap = () => {
    const link = document.getElementById('bootstrap-css');
    if (link) {
      link.parentNode.removeChild(link);
    }
  };

  return (
    <section className="Home" id="home">
      <Container>
        <Row className="align-items-center">
          <Col xs={12} md={6} xl={7} className="bordered-col">
            <TrackVisibility>
              {({ isVisible }) => 
                <div className={isVisible ? "animate__animated animate__fadeIn first-column-bg" : "first-column-bg"}>
                  <h1>{`ברוכים הבאים למחסן החיובי`}</h1>
                  <h1>
                    <span className="txt-rotate" dataperiod="1000" data-rotate='[ "שמח לראות אותכם", "תודה שבאתם אלינו", "מטרת האתר לעזור לאנשים" ]'>
                      <span className="wrap">{text}</span>
                    </span>
                  </h1>
                  <p>דני קלמן ז״ל, חבר קיבוץ ראש צורים, נפטר ממחלה קשה בכסליו תש״ע.
״מחסן חיובי״ הוא השם שדני נתן למחסן שהקים עבור ציוד להשאלה לצורך סיוע בשמחות פרטיות וציבוריות בקיבוץ.
כיום, אנחנו ממשיכים ומנציחים את מפעלו של דני אשר משקף את תכונותיו והערכים שהאמין בהם.</p>
                  <div className="button-wrapper">
                    <NavLink to="/ViewInventory" className="connect-button">
                      <span>לצפיה במוצרי המחסן</span> 
                      <ArrowLeftCircle size={24} />
                    </NavLink>
                  </div>
                </div>
              }
            </TrackVisibility>
          </Col>
          <Col xs={12} md={6} xl={5} className="bordered-col">
            <TrackVisibility>
              {({ isVisible }) =>
                <div className={isVisible ? "animate__animated animate__zoomIn" : ""}>
                  <img src={headerImg} alt="Header Img"/>
                </div>
              }
            </TrackVisibility>
          </Col>
        </Row>
      </Container>
    </section>
  );
};
