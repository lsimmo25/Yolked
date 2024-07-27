import React from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./WorkoutForm.css";

const initialValues = {
  date: "",
  exercises: [
    {
      name: "",
      newExercise: "",
      sets: [{ weight: "", reps: "" }],
    },
  ],
};

const validationSchema = Yup.object().shape({
  date: Yup.string().required("Date is required"),
  exercises: Yup.array().of(
    Yup.object().shape({
      name: Yup.string(),
      newExercise: Yup.string(),
      sets: Yup.array().of(
        Yup.object().shape({
          weight: Yup.number().required("Weight is required").positive(),
          reps: Yup.number().required("Reps are required").positive().integer(),
        })
      ),
    })
  ),
});

const WorkoutForm = ({ updateWorkouts, exercises }) => {
  const handleSubmit = (values, { resetForm }) => {
    const formattedValues = {
      ...values,
      exercises: values.exercises.map(ex => ({
        ...ex,
        name: ex.newExercise || ex.name
      }))
    };

    fetch("/workouts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formattedValues),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.errors) {
          console.error(data.errors);
        } else {
          updateWorkouts();
          resetForm();
        }
      })
      .catch((error) => {
        console.error("Error adding workout:", error);
      });
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values }) => (
        <Form className="form-container">
          <h2>Add Workout</h2>
          <div className="form-row">
            <label htmlFor="date">Date:</label>
            <Field name="date" type="date" />
            <ErrorMessage name="date" component="div" className="error-message" />
          </div>

          <FieldArray name="exercises">
            {({ push, remove }) => (
              <div>
                <table>
                  <thead>
                    <tr>
                      <th>Exercise</th>
                      <th>Weight</th>
                      <th>Reps</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {values.exercises.map((exercise, exerciseIndex) => (
                      <React.Fragment key={exerciseIndex}>
                        <tr>
                          <td>
                            <Field as="select" name={`exercises.${exerciseIndex}.name`}>
                              <option value="">Select Exercise</option>
                              {exercises.map((exercise) => (
                                <option key={exercise} value={exercise}>
                                  {exercise}
                                </option>
                              ))}
                            </Field>
                            <ErrorMessage name={`exercises.${exerciseIndex}.name`} component="div" className="error-message" />
                            <div>or</div>
                            <Field name={`exercises.${exerciseIndex}.newExercise`} placeholder="New Exercise" type="text" />
                            <ErrorMessage name={`exercises.${exerciseIndex}.newExercise`} component="div" className="error-message" />
                          </td>
                          <td>
                            <Field name={`exercises.${exerciseIndex}.sets.0.weight`} type="number" />
                            <ErrorMessage name={`exercises.${exerciseIndex}.sets.0.weight`} component="div" className="error-message" />
                          </td>
                          <td>
                            <Field name={`exercises.${exerciseIndex}.sets.0.reps`} type="number" />
                            <ErrorMessage name={`exercises.${exerciseIndex}.sets.0.reps`} component="div" className="error-message" />
                          </td>
                          <td>
                            <button type="button" onClick={() => remove(exerciseIndex)} className="remove-exercise">
                              x
                            </button>
                          </td>
                        </tr>
                        <FieldArray name={`exercises.${exerciseIndex}.sets`}>
                          {({ push: pushSet, remove: removeSet }) => (
                            <React.Fragment>
                              {exercise.sets.slice(1).map((set, setIndex) => (
                                <tr key={setIndex + 1}>
                                  <td></td>
                                  <td>
                                    <Field name={`exercises.${exerciseIndex}.sets.${setIndex + 1}.weight`} type="number" />
                                    <ErrorMessage name={`exercises.${exerciseIndex}.sets.${setIndex + 1}.weight`} component="div" className="error-message" />
                                  </td>
                                  <td>
                                    <Field name={`exercises.${exerciseIndex}.sets.${setIndex + 1}.reps`} type="number" />
                                    <ErrorMessage name={`exercises.${exerciseIndex}.sets.${setIndex + 1}.reps`} component="div" className="error-message" />
                                  </td>
                                  <td>
                                    <button type="button" className="remove-set" onClick={() => removeSet(setIndex + 1)}>
                                      x
                                    </button>
                                  </td>
                                </tr>
                              ))}
                              <tr>
                                <td colSpan="4">
                                  <button
                                    type="button"
                                    onClick={() => pushSet({ weight: "", reps: "" })}
                                  >
                                    Add Set
                                  </button>
                                </td>
                              </tr>
                            </React.Fragment>
                          )}
                        </FieldArray>
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
                <div className="button-container">
                  <button type="button" onClick={() => push({ name: "", newExercise: "", sets: [{ weight: "", reps: "" }] })} className="add-exercise">
                    Add Exercise
                  </button>
                  <button type="submit" className="submit">Submit</button>
                </div>
              </div>
            )}
          </FieldArray>
        </Form>
      )}
    </Formik>
  );
};

export default WorkoutForm;
