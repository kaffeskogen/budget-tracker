import { NumberParser } from "./number-formatting";



describe('number-formatting', () => {

    let parser: NumberParser;

    beforeEach(() => {
        parser = new NumberParser('sv-SE')
    })

    it('should format thousand seperators', () => {

        const result = parser.format(1234);
        expect(result).toBe("1\xa0234")

    });

    it('should extract thousand-vale', () => {

        const str = parser.format(1234.45);
        const nbr = parser.parse(str);
        expect(nbr).toBe(1234.45)

    });

    it('should extract single value', () => {

        const str = parser.format(5);
        const nbr = parser.parse(str);
        expect(nbr).toBe(5)

    });


});