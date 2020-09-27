import React from "react";
import "./App.css";
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
  CardFlex: {
    width: "500px",
    fontFamily: "Mitr",
    backgroundColor: "white",
    padding: "1.5rem",
    borderRadius: "20px",
  },
  CardFlex2: {
    marginTop: "100px",
    width: "500px",
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
    backgroundImage: "linear-gradient(to top, #ff0844 0%, #ffb199 100%)",
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
          "http://139.59.226.161/api/sentiment/predict?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoibG9kYXNoIiwicGFzcyI6Im1hc3Rlcl9Ac3JnODM0In0.JblcVJnoYP2lSvtuO7JsT5oElhK4nRt4OjCLW6voFTc",
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

    fetchData();
  }
  return (
    <div className="App">
      <header className="App-header">
        <Typography>
          <h1 className={classes.title}>
            ระบบวิเคราะห์อารมณ์ของประโยค ด้วยเทคโนโลยีปัญญาประดิษฐ์ เวอร์ชั่น
            1.0.2
          </h1>
        </Typography>
        <form onSubmit={predict}>
          <Box position="flex" justifyContent="center">
            <Card className={classes.CardFlex}>
              <Typography>
                <h1 className={classes.title}>วิเคราะห์ประโยค</h1>
              </Typography>
              <TextareaAutosize
                className={classes.title}
                style={{
                  borderRadius: "10px",
                  width: "450px",
                  padding: "0.5rem",
                  fontSize: "18px",
                }}
                aria-label="minimum height"
                rowsMin={5}
                colsMin={5}
                value={input.sentence}
                placeholder="ระบุข้อความ"
                onChange={handleChange}
              />
              <Button className={classes.Predict} type="submit">
                {loading && (
                  <CircularProgress
                    size={24}
                    className={classes.buttonProgress}
                  />
                )}
                วิเคราะห์
              </Button>
            </Card>
          </Box>
        </form>

        <Box position="flex" justifyContent="center">
          <Collapse in={open}>
            <Card className={classes.CardFlex2} style={{ overflowY: "scroll" }}>
              <Typography>
                <h1 className={classes.title}>ผลการวิเคราะห์ประโยค</h1>
              </Typography>
              <Typography
                style={{
                  backgroundColor: "#89beb3",
                  color: "white",
                  marginLeft: "10px",
                }}
              >
                <h3 className={classes.title}>
                  ประโยคนี้เป็น {results.sentiment}
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
                <h3 className={classes.title}>Keywords:</h3>
              </Typography>
              {typeof results.Keyword !== "undefined" ? (
                results.Keyword.map((word) => (
                  <Box position="flex" justifyContent="flex-start">
                    <Chip
                      label={word}
                      style={{ backgroundColor: "#ff0844", color: "white" }}
                    />
                  </Box>
                ))
              ) : (
                <Typography>
                  <h3 className={classes.title}>ไม่พบ Keyword</h3>
                </Typography>
              )}

              {typeof results.ranking !== "undefined" ? (
                <div>
                  <Chip
                    label={
                      "Positive " + results.ranking["Positive"].toFixed(2) + "%"
                    }
                    style={{
                      backgroundColor: "#89beb3",
                      color: "white",
                      marginLeft: "10px",
                    }}
                  />
                  <Chip
                    label={
                      "Question " + results.ranking["Question"].toFixed(2) + "%"
                    }
                    style={{
                      backgroundColor: "#51adcf",
                      color: "white",
                      marginLeft: "10px",
                    }}
                  />
                  <Chip
                    label={
                      "Netural " + results.ranking["Netural"].toFixed(2) + "%"
                    }
                    style={{
                      backgroundColor: "#ffd571",
                      color: "black",
                      marginLeft: "10px",
                    }}
                  />
                  <Chip
                    label={
                      "Negative " + results.ranking["Negative"].toFixed(2) + "%"
                    }
                    style={{
                      backgroundColor: "#ff0844",
                      color: "white",
                      marginLeft: "10px",
                    }}
                  />
                </div>
              ) : (
                <Typography>
                  <h3 className={classes.title}>ไม่พบ Keyword</h3>
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
