export default function refreshAlert(e){
	console.log(e.key)
	if(e.key === 'F5'){
		// e.preventDefault();
		alert('刷新页面会导致未保存的内容消失')
		sessionStorage.clear();
	}
}