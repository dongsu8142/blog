export const getRelativeTimeString = (date: Date) => {
	const now = new Date();
	const diffInSeconds = Math.floor((Number(now) - Number(date)) / 1000);

	if (diffInSeconds < 60) {
		return "방금 전";
	}
	if (diffInSeconds < 3600) {
		const minutes = Math.floor(diffInSeconds / 60);
		return `${minutes}분 전`;
	}
	if (diffInSeconds < 86400) {
		const hours = Math.floor(diffInSeconds / 3600);
		return `${hours}시간 전`;
	}
	const days = Math.floor(diffInSeconds / 86400);
	return `${days}일 전`;
};
