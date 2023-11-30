import * as Yup from "yup";
import axios from "axios";
import styles from "./HighScoreForm.module.scss";
import { useNavigate } from "react-router-dom";
import { Spinner } from "../../../components/Spinner";
import { Formik, Form, Field } from "formik";
import { useState } from "react";

type HighScoreFormProps = {
  score: number;
};

enum FieldName {
  INITIALS = "initials",
}

type Values = Record<FieldName, string>;

const Schema = Yup.object().shape({
  [FieldName.INITIALS]: Yup.string()
    .max(3, "Initials must be 3 characters")
    .min(3, "Initials must be 3 characters")
    .required("Initials required"),
});

export const HighScoreForm = ({ score }: HighScoreFormProps) => {
  const navigate = useNavigate();
  const [isError, setIsError] = useState(false);

  const handleSubmit = async ({ initials }: Values) => {
    return await axios
      .put(
        process.env.REACT_APP_ADDSCOREAPI || "http://localhost:3000/add-score",
        { score: { name: initials, score: score } }
      )
      .then(() => navigate("/leaderboard"))
      .catch((e) => console.log(e));
  };

  return (
    <div className={styles.highscoreWrapper}>
      <h1 className={styles.title}>New HighScore!</h1>
      <Formik<Values>
        initialValues={{ initials: "" }}
        validationSchema={Schema}
        validateOnChange={false}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors }) => (
          <Form
            className={styles.highscoreForm}
            onChange={() => setIsError(false)}
          >
            <Field
              className={styles.formInput}
              name={FieldName.INITIALS}
              placeholder="___"
              maxLength={3}
              required
            />
            <div className={styles.formError}>
              {isError ? errors.initials : ""}
            </div>
            <button disabled={isSubmitting} className={styles.formBtn}>
              {isSubmitting ? <Spinner /> : "Submit"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};
