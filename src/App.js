import React from "react";
import "./App.css";
import Modal from '@material-ui/core/Modal';
import axios from "axios";
import {
  makeStyles,
  Button,
  Box,
  Chip,
  Typography,
  Collapse,
  Card,
  CircularProgress,
  TextareaAutosize,
} from "@material-ui/core/";
const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    fontFamily: "Mitr",
  },

  title: {
    fontFamily: "Mitr",
    flexGrow: 1,
  },
  keywords: {
    fontFamily: "Mitr",
    flexGrow: 1,
  },
  CardFlex: {
    width: "auto",
    fontFamily: "Mitr",
    backgroundColor: "white",
    padding: "1.5rem",
    borderRadius: "20px",
  },
  CardFlex2: {
    marginTop: "100px",
    width: "auto",
    fontFamily: "Mitr",
    backgroundColor: "white",
    padding: "1.5rem",
    borderRadius: "20px",
    height: "450px",
  },
  Predict: {
    color: "white",
    width: "450px",
    borderRadius: "20px",
    fontFamily: "Mitr",
    backgroundImage: "linear-gradient(to top, #ff0844 0%, #ff3199 100%)",
  },
  buttonProgress: {
    color: "white",
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
}));
function App() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [results, setResult] = React.useState("");
  const [input, setInput] = React.useState({ sentence: "" });

  function handleChange(e) {
    setInput({ sentence: e.target.value });
    // console.log(input.sentence);
  }
  function predict(e) {
    e.preventDefault();
    // console.log(input.sentence);
    setLoading(true);
    const fetchData = async () => {
      await axios
        .post(
          "http://128.199.144.219/api/sentiment/predict?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoibG9kYXNoIiwicGFzcyI6Im1hc3Rlcl9Ac3JnODM0In0.JblcVJnoYP2lSvtuO7JsT5oElhK4nRt4OjCLW6voFTc",
          input
        )

        .then(
          (response) => {
            setTimeout(() => {
              setLoading(false);
              setOpen(true);
              let results = response.data.response;
              // console.log(results);
              setResult(results);
            }, 1000);
          },
          (error) => {
            console.log(error.text);
          }
        );
    };

    if (input.sentence.length > 0) {
      fetchData();
    }
  }
  function traslate(text) {
    console.log(text);
    if (text === "Positive") {
      return "เชิงบวก";
    } else if (text === "Negative") {
      return "เชิงลบ";
    } else if (text === "Question") {
      return "คำถาม";
    } else if (text === "Netural") {
      return "ทั่วไป";
    }
  }
  function get_image(text) {
    console.log(text);
    if (text === "Positive") {
      return "https://www.flaticon.com/svg/static/icons/svg/2210/2210715.svg";
    } else if (text === "Negative") {
      return "https://www.flaticon.com/svg/static/icons/svg/2210/2210827.svg";
    } else if (text === "Question") {
      return "https://www.flaticon.com/svg/static/icons/svg/3649/3649795.svg";
    } else if (text === "Netural") {
      return "https://www.flaticon.com/svg/static/icons/svg/742/742774.svg";
    }
  }
  return (
    <div className="App">
      <header className="App-header">
        <Typography>
          <h1 className={classes.title}>
            ระบบวิเคราะห์อารมณ์ของประโยค ด้วยเทคโนโลยีปัญญาประดิษฐ์
          </h1>
        </Typography>

        <form onSubmit={predict}>
          <Box position="flex" justifyContent="center">
            <Card className={classes.CardFlex}>
              <img
                width="50px"
                src="https://www.flaticon.com/svg/static/icons/svg/1838/1838353.svg"
                alt="predict"
              />
              <Typography>
                <h1 className={classes.title}>วิเคราะห์ประโยค</h1>
              </Typography>
              <TextareaAutosize
                className={classes.title}
                style={{
                  borderRadius: "10px",
                  width: "auto",
                  padding: "0.5rem",
                  fontSize: "18px",
                }}
                aria-label="minimum height"
                rowsMin={5}
                colsMin={3}
                value={input.sentence}
                placeholder="ระบุข้อความ"
                onChange={handleChange}
              />
              <Button className={classes.Predict} type="submit">
                {input.sentence.length > 0 ? (
                  loading && (
                    <CircularProgress
                      size={24}
                      className={classes.buttonProgress}
                    />
                  )
                ) : (
                  <div></div>
                )}
                วิเคราะห์
              </Button>
            </Card>
          </Box>
        </form>

        <Box position="flex" justifyContent="center">
          <Collapse in={open}>
            <Card className={classes.CardFlex2} style={{ overflow: "scroll" }}>
              <img
                width="50px"
                src={get_image(results.PredictedClass)}
                alt="predict"
              />
              <Typography>
                <h1 className={classes.title}>ผลการวิเคราะห์ประโยค</h1>
              </Typography>
              <Typography
                style={{
                  backgroundImage:
                    "radial-gradient( circle 862px at 6% 18%,  rgba(21,219,149,1) 9.4%, rgba(26,35,160,1) 83.6% )",
                  color: "white",
                  marginLeft: "10px",
                  borderRadius: 20,
                }}
              >
                <h3 className={classes.title}>
                  ประโยคนี้เป็น {traslate(results.PredictedClass)}
                </h3>
              </Typography>
              <Typography>
                <h3 className={classes.title}>ประโยค: {results.Input}</h3>
              </Typography>
              <Typography>
                <h3 className={classes.title}>
                  จำนวนตัวอักษร: {results.Tokens} ตัว
                </h3>
              </Typography>
              <Typography>
                <h3 className={classes.keyword}>Keywords:</h3>
              </Typography>
              {typeof results.Keywords !== "undefined" ? (
                <div>
                  {results.Keywords.map((keyword, item) => (
                    <Chip
                      key={item}
                      label={keyword}
                      style={{
                        backgroundImage:
                          "radial-gradient( circle farthest-corner at 10% 20%,  rgba(102,116,236,1) 0%, rgba(50,231,219,1) 90% )",
                        color: "white",
                        marginLeft: "10px",
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div></div>
              )}

              {typeof results.RankingByCoefident !== "undefined" ? (
                <div>
                  <Chip
                    label={
                      "เชิงบวก " +
                      results.RankingByCoefident["Positive"].toFixed(2) +
                      "%"
                    }
                    style={{
                      backgroundImage:
                        "radial-gradient( circle 862px at 6% 18%,  rgba(21,219,149,1) 9.4%, rgba(26,35,160,1) 83.6% )",
                      color: "white",
                      marginLeft: "10px",
                    }}
                  />
                  <Chip
                    label={
                      "คำถาม " +
                      results.RankingByCoefident["Question"].toFixed(2) +
                      "%"
                    }
                    style={{
                      backgroundImage:
                        "linear-gradient( 111.4deg,  rgba(122,192,233,1) 18.8%, rgba(4,161,255,1) 100.2% )",
                      color: "white",
                      marginLeft: "10px",
                    }}
                  />
                  <Chip
                    label={
                      "ทั่วไป " +
                      results.RankingByCoefident["Netural"].toFixed(2) +
                      "%"
                    }
                    style={{
                      backgroundImage:
                        "linear-gradient( 109.6deg,  rgba(255,219,47,1) 11.2%, rgba(244,253,0,1) 100.2% )",
                      color: "black",
                      marginLeft: "10px",
                    }}
                  />
                  <Chip
                    label={
                      "เชิงลบ " +
                      results.RankingByCoefident["Negative"].toFixed(2) +
                      "%"
                    }
                    style={{
                      backgroundImage:
                        "radial-gradient( circle 830px at 95.6% -5%,  rgba(244,89,128,1) 0%, rgba(223,23,55,1) 90% )",
                      color: "white",
                      marginLeft: "10px",
                    }}
                  />
                </div>
              ) : (
                <Typography>
                  <h3 className={classes.title}>erorr</h3>
                </Typography>
              )}
              <Button
                style={{ marginTop: "20px" }}
                className={classes.Predict}
                onClick={() => {
                  setOpen(false);
                }}
              >
                ปิด
              </Button>
            </Card>
          </Collapse>
          <Modal
            open={true}
            onClose={() => setOpenErr(false)}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
          >
            <Card
              style={{
                width: "420px",
                marginLeft: "150px",
                padding: "1rem",
                borderRadius: "30px"
              }}
            >
              <Typography>
                <h1 style={{ color: "red" }}> Error 503 </h1>
                <h2> Internal API Server Error</h2>
              </Typography>
            </Card>
          </Modal>
        </Box>
      </header>
      <style>
        @import
        url('https://fonts.googleapis.com/css2?family=Mitr:wght@300&display=swap');
      </style>
    </div>
  );
}

export default App;
