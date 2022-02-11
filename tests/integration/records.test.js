const request = require('supertest');
let server

describe('/getRecords', () => {
    beforeEach(() => { server = require('../../index'); })
    afterEach(async () => { 
        server.close(); 
    });

    describe('POST /', () => {

        let startDate;
        let endDate;
        let minCount;
        let maxCount; 
    
        const exec = async () => {
          return await request(server)
            .post('/getRecords')
            .send({ 
                startDate,
                endDate,
                minCount,
                maxCount
            });
        }
    
        it('should return 400 if startDate is not in required format', async () => {
            startDate = '01-26-2015';
            endDate = '2017-02-02';
            minCount = 2900;
            maxCount = 3000
          
          const res = await exec();
          expect(res.status).toBe(400);
        });

        it('should return 400 if endDate is not in required format', async () => {
            startDate = '2015-01-26';
            endDate = '02-02-2017';
            minCount = 2900;
            maxCount = 3000
          
          const res = await exec();
          expect(res.status).toBe(400);
        });

        it('should return 400 if mincount is not present or in required format', async () => {
            startDate = '2015-01-26';
            endDate = '2017-02-02';
            minCount = 2700;
            maxCount = 3000
          
          const res = await exec();
          expect(res.status).toBe(400);
        });

        it('should return 400 if maxCount is not present or in required format', async () => {
            startDate = '2015-01-26';
            endDate = '2017-02-02';
            minCount = 2700;
            maxCount = 'abc'
          
          const res = await exec();
          expect(res.status).toBe(400);
        });

        it('should return 200 if the request is successful', async () => {
            startDate = '2015-01-26';
            endDate = '2017-02-02';
            minCount = 2700;
            maxCount = 3000
          
          const res = await exec();
          expect(res.status).toBe(200);
        });
      });
})