import React, { useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { UserContext } from '../Context/UserContext';
import './FoodForm.css';

const FoodForm = ({ addFood }) => {
  const { user } = useContext(UserContext);

  const formik = useFormik({
    initialValues: {
      date: new Date().toLocaleDateString('en-CA'),
      foodName: '',
      calories: '',
    },
    validationSchema: Yup.object({
      date: Yup.string().required('Date is required'),
      foodName: Yup.string().required('Food Name is required'),
      calories: Yup.number()
        .required('Calories are required')
        .positive('Calories must be a positive number'),
    }),
    onSubmit: (values, { resetForm }) => {
      fetch('/foods', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          food_name: values.foodName,
          calories: parseInt(values.calories),
          date: values.date,
        }),
      })
        .then((r) => {
          if (!r.ok) {
            throw new Error('Network response was not ok ' + r.statusText);
          }
          return r.json();
        })
        .then((data) => {
          console.log('Food logged:', data);
          addFood(data);
          resetForm();
        })
        .catch((error) => console.error('Error logging food:', error));
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="food-form">
      <label>
        Date:
        <input
          type="date"
          name="date"
          value={formik.values.date}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          required
        />
        {formik.touched.date && formik.errors.date ? (
          <div className="error-message">{formik.errors.date}</div>
        ) : null}
      </label>
      <label>
        Food Name:
        <input
          type="text"
          name="foodName"
          value={formik.values.foodName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Enter Food Name"
          required
        />
        {formik.touched.foodName && formik.errors.foodName ? (
          <div className="error-message">{formik.errors.foodName}</div>
        ) : null}
      </label>
      <label>
        Calories:
        <input
          type="number"
          name="calories"
          value={formik.values.calories}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Enter Calories"
          required
        />
        {formik.touched.calories && formik.errors.calories ? (
          <div className="error-message">{formik.errors.calories}</div>
        ) : null}
      </label>
      <button type="submit">Submit</button>
    </form>
  );
};

export default FoodForm;
