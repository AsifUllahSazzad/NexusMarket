export const postMerchant = async (req, res) => {
  const body = await req.body;
  console.log('Success: ',body);

  res.send();
};

export const postCustomer = async (req, res) => {
  const body = await req.body;
   console.log('Success: ',body);

  res.send();
};
