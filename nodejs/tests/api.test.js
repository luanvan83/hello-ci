const supertest = require("supertest")
const baseURL = process.env.TARGET_URL

const request = supertest(baseURL)
const API_KEY = 'XXXXXXX';

describe("Testing public access API", () => {
    it("should return 404", async () => {
        const response = await supertest(baseURL).get("/");
        expect(response.statusCode).toBe(404);
    });
    it("healthcheck should return 200", async () => {
        const response = await request.get("/front/image").set('x-api-key', API_KEY);
        expect(response.statusCode).toBe(200);
    });
});

describe("Testing upload image with Api Key", () => {
    beforeAll(async () => {
    })
    afterAll(async () => {
    })
    
    it("Upload image should return 404", async () => {
        const response = await request
            .post('/')
            .field('location', '111')
            .attach('image', 'tests/fixtures/small.jpg');
        expect(response.statusCode).toBe(404);
    });

    it("Upload image should return 403", async () => {
        const response = await request
            .post('/front/image')
            .field('location', '111')
            .attach('image', 'tests/fixtures/fake.txt')
        expect(response.statusCode).toBe(403);
    });

    it("Upload image should return 422", async () => {
        const response = await request
            .post('/front/image')
            .field('location', '111')
            .attach('image', 'tests/fixtures/fake.txt')
            .set('x-api-key', API_KEY);
        expect(response.statusCode).toBe(422);
    });
});

describe("Testing upload image and store location with Api Key", () => {
    beforeAll(async () => {
    })
    afterAll(async () => {
    })

    describe("Upload image and store location should return 200", () => {
        const categories = [{
            label: '交差点',
            tags: [
                '歩行者が危険',
                '自動車が危険',
                '自転車が危険',
                '歩車分離式信号',
                '横断歩道かすれ'
            ]
        }, {
            label: '車道',
            tags: [
                '歩行者が危険',
                '自動車が危険',
                '自転車が危険',
                'ひび割れ',
                'ポットホール',
                'わだち',
                '路駐'
            ]
        }, {
            label: '歩道',
            tags: [
                '歩行者が危険',
                '自転車が危険',
                'ひび割れ',
                'わだち',
                '段差',
                '歩きづらい'
            ]
        }, {
            label: '電柱',
            tags: [
                '傾き',
                '汚れ'
            ]
        }, {
            label: 'コインパーキング',
            tags: [
                '看板',
                '出入口',
                'パーキング内'
            ]
        }, {
            label: '工事',
            tags: [
                '道路工事',
                '水道工事',
                'ガス工事',
                '建造物',
                '看板'
            ]
        }, {
            label: 'ロードペイント',
            tags: [
                'かすれ',
                '汚れ'
            ]
        }, {
            label: '信号',
            tags: [
                '傾き',
                '見辛い',
                '汚れ',
                'サイクルが悪い'
            ]
        }, {
            label: '横断歩道',
            tags: [
                'かすれ',
                '汚れ'
            ]
        }, {
            label: '標識',
            tags: [
                '傾き',
                '見辛い',
                '汚れ'
            ]
        }, {
            label: '看板', tags: [
                '公園',
                '店舗'
            ]
        }];

        const noOfUsersPerday = process.env.NUMBER_OF_USER || 3
        const noOfLocationsPerday = process.env.NUMBER_OF_LOCATION || 20
        const dataSet = [];

        for (let idxUser = 0; idxUser < noOfUsersPerday; idxUser++) {
            for (let idxLocation = 0; idxLocation < noOfLocationsPerday; idxLocation++) {
                const locationItem = {
                    location_id: `9100${idxLocation}`,
                    user_name: `Jester ${idxUser}`,
                    title: `Location name 9000${idxLocation}`,
                    content: `Test desc\ntest desc\ntest desc\ntest desc 9000${idxLocation}`
                }
                // get random category
                const selectedCategory = categories[Math.floor(Math.random()*categories.length)]
                locationItem.category = selectedCategory.label
                
                // get random tags in category
                let loopCnt = Math.floor(Math.random() * (selectedCategory.tags.length-1)) + 1
                const selectedTags = [];
                for (let cnt = 0; cnt < loopCnt; cnt++) {
                    const selectedTag = selectedCategory.tags[Math.floor(Math.random()*selectedCategory.tags.length)]
                    selectedTags.push(selectedTag)
                }
                locationItem.tags = selectedTags
                dataSet.push(locationItem)
            }
        }

        console.log(dataSet)

        it.each(dataSet)(
            'Call API matrix',
            async (locationItem) => {
                const images = [];
                let imageName = process.env.IMAGE || '9MB.jpg'
                for (let index = 1; index <= 10; index++) {
                    const response = await request
                        .post('/front/image')
                        .field('location', locationItem.location_id)
                        .attach('image', `tests/fixtures/${imageName}`)
                        .set('x-api-key', API_KEY)
                    expect(response.statusCode).toBe(200);
                    const imgBody = response.body;
                    images.push({
                        image_name: imgBody.key,
                        image_size: '10000000',
                        category: locationItem.category,
                        tags: locationItem.tags.join(),
                        metadata: JSON.stringify({
                            "Image Height":{"value":'640',"description":"640px"}
                        })
                    })
                }
                
                const locationInfo = {
                    location_id: locationItem.location_id,
                    user_name: locationItem.user_name,
                    title: locationItem.title,
                    content: locationItem.content,
                    images: images
                }

                console.log('-- SAVE LOCATION --', locationInfo);
                const responseLoc = await request
                    .post('/front/location')
                    .send(locationInfo)
                    .set('Accept', 'application/json')
                    .set('x-api-key', API_KEY);
                expect(responseLoc.statusCode).toBe(200);

                console.log('-- RES LOCATION --', responseLoc.body);

                const locBody = responseLoc.body;
                expect(locBody.message).toBe('store location ok')
            }, 5 * 60 * 1000
        );
    });
});