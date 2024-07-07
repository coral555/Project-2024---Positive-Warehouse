import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import headerImg from "../../assets/svg/5CPhLg01.svg";
import { ArrowLeftCircle } from 'react-bootstrap-icons';
import 'animate.css';  
import './Home.css';
import TrackVisibility from 'react-on-screen';

export const Home = () => {
  const [loopNum, setLoopNum] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, setText] = useState('');
  const [delta,  setDelta] = useState(300 - Math.random() * 100);
  const [index,  setIndex] = useState(1);
  const toRotate = [ "תודה שבאתם אלינו", "מטרת האתר לעזור לאנשים","שמח לראות אותכם" ];
  const period = 2000;

  useEffect(() => {
    let ticker = setInterval(() => {
      tick();
    }, delta);

    return () => { clearInterval(ticker) };
  }, [text])

  const tick = () => {
    let i = loopNum % toRotate.length;
    let fullText = toRotate[i];
    let updatedText = isDeleting ? fullText.substring(0, text.length - 1) : fullText.substring(0, text.length + 1);

    setText(updatedText);

    if (isDeleting) {
      setDelta(prevDelta => prevDelta / 2);
    }

    if (!isDeleting && updatedText === fullText) {
      setIsDeleting(true);
      setIndex(prevIndex => prevIndex - 1);
      setDelta(period);
    } else if (isDeleting && updatedText === '') {
      setIsDeleting(false);
      setLoopNum(loopNum + 1);
      setIndex(1);
      setDelta(500);
    } else {
      setIndex(prevIndex => prevIndex + 1);
    }
  }

  return (
    <section className="Home" id="home">
      <Container>
        <Row className="aligh-items-center">
        <Col xs={12} md={6} xl={7}  >
            <TrackVisibility>
              {({ isVisible }) => 
              <div className={isVisible ? "animate__animated animate__fadeIn" : ""}>
                <span className="tagline">ברוכים הבאים למחסן החיובי</span>
                <div className="first-column-bg">
                <h1>{`היי אני דני קלמן ז״ל`} <span className="txt-rotate" dataPeriod="1000" data-rotate='[ "שמח לראות אותכם", "תודה שבאתם אלינו", "מטרת האתר לעזור לאנשים" ]'><span className="wrap">{text}</span></span></h1>
                  <p> דני קלמן ז״ל, חבר קיבוץ ראש צורים, נפטר ממחלה קשה בכסליו תש״ע. 
״מחסן חיובי״ הוא השם שדני נתן למחסן שהקים עבור ציוד להשאלה לצורך סיוע בשמחות פרטיות וציבוריות בקיבוץ.
כיום, אנחנו ממשיכים ומנציחים את מפעלו של דני אשר משקף את תכונותיו והערכים האמין בהם.</p>
</div>
<button className="connect-button"> <span>סעיד עאסלה  </span> <ArrowLeftCircle size={24}  /> </button>
              
              </div>}
            </TrackVisibility>
          </Col>
          <Col xs={12} md={6} xl={5} >
            <TrackVisibility>
              {({ isVisible }) =>
                <div className={isVisible ? "animate__animated animate__zoomIn" : ""}>
                  <img src={headerImg} alt="Header Img"/>
                </div>}
            </TrackVisibility>
          </Col>

        </Row>
      </Container>
    </section>
  )
}
// style={{ border: '1px solid #ddd'}}