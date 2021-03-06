import React from "react";
import Moment from "react-moment";
import PropTypes from "prop-types";

const ProfileEducation = ({
  education: { school, degree, fieldOfStudy, current, to, from, description },
}) => {
  return (
    <div>
      <h3 className="text-dark">{school}</h3>
      <p>
        <Moment format="YYY/MM/DD">{from}</Moment> -{" "}
        {!to ? "Now" : <Moment format="YYY/MM/DD">{to}</Moment>}
      </p>
      <p>
        <strong>Degree</strong> {degree}
      </p>
      <p>
        <strong>Field Of Study</strong> {fieldOfStudy}
      </p>
      <p>
        <strong>Description</strong> {description}
      </p>
    </div>
  );
};

ProfileEducation.propTypes = {
  education: PropTypes.array.isRequired,
};

export default ProfileEducation;
