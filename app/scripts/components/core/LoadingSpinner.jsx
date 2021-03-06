import React from 'react';
import { react2angular } from 'react2angular';

export const LoadingSpinner = () =>
  <h1 className='text-center'><i className='fa fa-spinner fa-spin'></i></h1>

export default react2angular(LoadingSpinner);
