import React from 'react';

const Logout = () => {

  localStorage.clear();

  document.location = '/';

  return (
    <div>

    </div>
  )
}

export default Logout;
 