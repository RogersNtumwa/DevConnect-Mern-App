import React, { Fragment } from "react";
import PropTypes from "prop-types";
import Moment from "react-moment";
import { connect } from "react-redux";
import { deleteEducation } from "../../actions/profile";

const Education = ({ education, deleteEducation }) => {
  const qualifications = education.map((edu) => (
    <tr key={edu._id}>
      <td>{edu.school}</td>
      <td className="hide-sm">{edu.degree}</td>
      <td>
        <Moment format="YYY/MM/DD">{edu.from}</Moment>-{" "}
        {edu.to === null ? (
          " Now"
        ) : (
          <Moment format="YYY/MM/DD">{edu.to}</Moment>
        )}
      </td>
      <th>
        <button
          onClick={() => deleteEducation(edu._id)}
          className="btn btn-danger"
        >
          Delete
        </button>
      </th>
    </tr>
  ));
  return (
    <Fragment>
      <h2 className="my-2">Education Credentails</h2>
      <table className="table">
        <thead>
          <tr>
            <th> School</th>
            <th className="hide-sm">degree</th>
            <th className="hide-sm">Years</th>
            <th />
          </tr>
        </thead>
        <tbody>{qualifications}</tbody>
      </table>
    </Fragment>
  );
};

Education.propTypes = {
  education: PropTypes.array.isRequired,
  deleteEducation: PropTypes.func.isRequired,
};

export default connect(null, { deleteEducation })(Education);
