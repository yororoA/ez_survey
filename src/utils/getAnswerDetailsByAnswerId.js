/* 通过answerId获取对应Answer的详细内容 */
export async function getAnswerDetailsByAnswerId(answreId) {
	const fetchResp = await fetch(`http://localhost:1337/api/answers/${answreId}?populate=answers`);
	if (!fetchResp.ok) {
		alert(`${fetchResp.status}: failed to fetch data from database_Answer`);
		return null;
	}
	const fetchData = await fetchResp.json();
	return fetchData.data;
}