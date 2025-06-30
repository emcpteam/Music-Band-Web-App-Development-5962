import React from 'react';
import * as FiIcons from 'react-icons/fi';

const SafeIcon = ({ icon, name, ...props }) => {
  let IconComponent;
  
  try {
    IconComponent = icon || (name && FiIcons[`Fi${name}`]);
  } catch (e) {
    IconComponent = FiIcons.FiAlertTriangle;
  }
  
  if (!IconComponent) {
    IconComponent = FiIcons.FiAlertTriangle;
  }
  
  return React.createElement(IconComponent, props);
};

export default SafeIcon;