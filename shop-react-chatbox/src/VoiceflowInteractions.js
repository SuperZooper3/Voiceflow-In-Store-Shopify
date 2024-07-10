const API_KEY = "VF.DM.668e8ab74739614b83262dff.zIhDF25G7evNRl29";

const vfInteract = async (user, userAction) => {
  const interractionUrl = `https://general-runtime.voiceflow.com/state/user/${user}/interact`;

  const payload = {
    action: userAction,
  };

  const data = await fetch(interractionUrl, {
    headers: {
      'Authorization': API_KEY,
      'accept': 'application/json',
      'content-type': 'application/json',
      'versionID': 'production',
    },
    method: 'POST',
    body: JSON.stringify(payload),
  });

  const postRes = await data.json();
  return postRes;
};

export {vfInteract};
