// validation.js

/** return errMsg: String  */
export function userNameValidation(input) {
    if(!input) {
        return 'ニックネームを入力してください';
      } else if(input.trim() === ''){
        return '空白のみの入力はできません';
      } else if(input.length >= 11) {
        return 'ニックネームは10文字以下で入力してください';
      } else {
        return;
      }
}