
export default class MathHelper {

    /**
     * Degree to radian converter
     * @param degree degree that is going to be converted to radian
     */
    static degreeToRadian(degree: number): number{
        const pi = Math.PI;
        return degree * (pi/180);
    }

    /**
     * Radian to degree converter
     * @param radian radian that is going to be converted to degree
     */
    static radianToDegree(radian: number): number{
        const pi = Math.PI;
        return radian * (180/pi);
    }
}