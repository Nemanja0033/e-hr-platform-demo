export function calculateDays(endDate: Date, startDate: Date){
    const MS_PER_DAY = 1000 * 60 * 60 * 24;
    return Math.ceil((endDate.getTime() - startDate.getTime()) / MS_PER_DAY);
}