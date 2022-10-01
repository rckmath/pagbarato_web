export const inputStyle = {
  paddingBottom: 1,
  '& label.Mui-focused': {
    color: '#012900',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#012900',
  },
  '& .MuiOutlinedInput-root.Mui-focused': {
    '& > fieldset': { borderColor: '#012900' },
  },
  '& .MuiFilledInput-underline:after': {
    borderBottomColor: '#012900',
  },
};

export const btnStyle = {
  backgroundColor: '#012900',
  margin: '8px 0',
};

export const newEntryBtnStyle = {
  backgroundColor: '#fb5607',
  margin: '8px 0',
  ':hover': { backgroundColor: '#fb560799' },
};
