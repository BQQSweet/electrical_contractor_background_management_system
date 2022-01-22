//表单校验相关方法
const checkEmail = (rule, value, callback) => {
  const regEmail = /^([A-Za-z0-9_-])+@([A-Za-z0-9_-])+(\.[A-Za-z0-9_-])+/;
  if (regEmail.test(value) || !value) {
    return callback();
  }
  callback(new Error("请输入合法的邮箱"));
};
const checkMobile = (rule, value, callback) => {
  const regMobile =
    /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
  if (regMobile.test(value) || !value) {
    return callback();
  }
  callback(new Error("请输入合法的手机号码"));
};
export { checkEmail, checkMobile };
