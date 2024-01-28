import * as dotenv from 'dotenv';

import { DB_VALUE_TO_DISPLAY_V2 } from './workingConditionsV2';

dotenv.config();

import * as fs from 'fs';
import { emitKeypressEvents } from 'readline';

import * as ES_Index from './Elasticsearch_Lib/Elasticsearch_Index_Control';
import * as ES_Search from './Elasticsearch_Lib/Elasticsearch_Search';
import * as Alg_Matching from './Matching_Alg_Lib/Matching_Cos_Similarity';
import * as Alg_License from './Matching_Alg_Lib/Matching_Research_license';

const pgp = require('pg-promise')();

// PostgreSQL 연결 정보 설정
const dbConfig = {
  host: '59.11.252.124',
  port: '9182',
  database: 'job_matching',
  user: 'admin',
  password: 'dps23zh41dj',
};

const db = pgp(dbConfig);

function mapDataString(dataString: string): string {
  // 쉼표로 문자열을 분할하여 배열 생성
  const dataItems: string[] = dataString.split(',');

  // 각 데이터 항목을 DB_VALUE_TO_DISPLAY_V2로 매핑
  const mappedData: string[] = dataItems.map(item => {
    return DB_VALUE_TO_DISPLAY_V2[item] || item; // 매핑되는 값이 없으면 그대로 반환
  });

  // 매핑된 데이터 항목들을 쉼표로 연결하여 문자열로 반환
  return mappedData.join(',');
}


async function PutStaffData(indexName_Staff)
{
  const tableName = 'instance_staff_datas';
  const query = `SELECT * FROM public."${tableName}"`;
  const data = await db.any(query);

  for (const db_data in data) {
    
    const detail_query_in_users = `SELECT id,type,job_type,name,birthday,sex,address,phone,email,profile_image FROM public.users WHERE id = '${data[db_data]['user_id']}'`;
    const query_result_in_users = await db.one(detail_query_in_users);
    
    const mappingData: { [key_name: string]: any } = {};
    
    mappingData['id']  = query_result_in_users['id']
    mappingData['type']  = query_result_in_users['type']
    mappingData['job']  = mapDataString(query_result_in_users['job_type'])
    mappingData['name']  = query_result_in_users['name']
    mappingData['birthDate']  = query_result_in_users['birthday']
    mappingData['gender']  = query_result_in_users['sex']
    mappingData['address']  = query_result_in_users['address']
    mappingData['phone']  = query_result_in_users['phone']
    mappingData['email']  = query_result_in_users['email']
    mappingData['applicantImage'] = query_result_in_users['profile_image'];

    if (mappingData['applicantImage'] === null) {
        mappingData['applicantImage'] = '';
    }

    const detail_query_in_users_licenses = `SELECT name FROM public.user_licenses WHERE user_id = '${data[db_data]['user_id']}'`;
    const query_result_in_users_licenses = await db.oneOrNone(detail_query_in_users_licenses);

    if (query_result_in_users_licenses !== null)
    {
      mappingData['licenses']  = query_result_in_users_licenses['name']
    }
    else
    {
      mappingData['licenses']  = ''
    }

    const detail_query_in_user_working_condition = `SELECT hope_addresses FROM public.user_working_conditions WHERE user_id = '${data[db_data]['user_id']}'`;
    const query_result_in_user_working_condition = await db.oneOrNone(detail_query_in_user_working_condition);

    mappingData['preferred_location'] = '';
    if (query_result_in_user_working_condition !== null)
    {
      if (Array.isArray(query_result_in_user_working_condition['hope_addresses'])) 
      {
        let count = 1;
        let detailregion = ''

        for (const citys in query_result_in_user_working_condition['hope_addresses'])
        {

          const resultvalue: string = query_result_in_user_working_condition['hope_addresses'][citys];
          
          for (const district in resultvalue['district'])
          {
            
            if (count == 1)
            {
              detailregion = resultvalue['city'] +' ' +  resultvalue['district'][district];
            }
            else
            {
              detailregion = ',' + resultvalue['city'] +' ' +  resultvalue['district'][district] ;
            }
            
            count = count+1;    
          mappingData['preferred_location'] += detailregion;
            
          }      
          
        }
        
      } 
      else 
      {
          mappingData['preferred_location'] = query_result_in_user_working_condition['hope_addresses'];
      }
    }

     await ES_Index.Index_Put_Data(indexName_Staff, mappingData);
    
  }

}

async function PutDentistData(indexName_dentist)
{
  const tableName = 'instance_dentist_datas';
  const query = `SELECT * FROM public."${tableName}"`;
  const data = await db.any(query);

  for (const db_data in data) {
    
    const detail_query_in_users = `SELECT id,type,job_type,name,birthday,sex,address,phone,email,profile_image FROM public.users WHERE id = '${data[db_data]['user_id']}'`;
    const query_result_in_users = await db.one(detail_query_in_users);
    
    const mappingData: { [key_name: string]: any } = {};
    
    mappingData['id']  = query_result_in_users['id']
    mappingData['type']  = query_result_in_users['type']
    mappingData['job']  = query_result_in_users['job_type']
    mappingData['name']  = query_result_in_users['name']
    mappingData['birthDate']  = query_result_in_users['birthday']
    mappingData['gender']  = query_result_in_users['sex']
    mappingData['address']  = query_result_in_users['address']
    mappingData['phone']  = query_result_in_users['phone']
    mappingData['email']  = query_result_in_users['email']
    mappingData['applicantImage'] = query_result_in_users['profile_image'];

    if (mappingData['applicantImage'] === null) {
        mappingData['applicantImage'] = '';
    }

    const detail_query_in_users_licenses = `SELECT name FROM public.user_licenses WHERE user_id = '${data[db_data]['user_id']}'`;
    const query_result_in_users_licenses = await db.oneOrNone(detail_query_in_users_licenses);

    if (query_result_in_users_licenses !== null)
    {
      mappingData['licenses']  = query_result_in_users_licenses['name']
    }
    else
    {
      mappingData['licenses']  = ''
    }

    const detail_query_in_user_working_condition = `SELECT hope_addresses FROM public.user_working_conditions WHERE user_id = '${data[db_data]['user_id']}'`;
    const query_result_in_user_working_condition = await db.oneOrNone(detail_query_in_user_working_condition);

    mappingData['preferredLocation'] = '';
    if (query_result_in_user_working_condition !== null)
    {
      if (Array.isArray(query_result_in_user_working_condition['hope_addresses'])) 
      {
        let count = 1;
        let detailregion = ''

        for (const citys in query_result_in_user_working_condition['hope_addresses'])
        {

          const resultvalue: string = query_result_in_user_working_condition['hope_addresses'][citys];
          
          for (const district in resultvalue['district'])
          {
            
            if (count == 1)
            {
              detailregion = resultvalue['city'] +' ' +  resultvalue['district'][district];
            }
            else
            {
              detailregion = ',' + resultvalue['city'] +' ' +  resultvalue['district'][district] ;
            }
            
            count = count+1;    
          mappingData['preferred_location'] += detailregion;
            
          }      
          
        }
        
      } 
      else 
      {
          mappingData['preferred_location'] = query_result_in_user_working_condition['hope_addresses'];
      }
    }

    await ES_Index.Index_Put_Data(indexName_dentist, mappingData);
    
  }

}


async function PutCompanyData(indexName_company)
{
  const tableName = 'instance_hospital_datas';
  const query = `SELECT * FROM public."${tableName}"`;
  const data = await db.any(query);

  for (const db_data in data) 
  {
    const mappingData: { [key_name: string]: any } = {};
    //joboffertype
    {
      const detail_query_in_users = `SELECT id,name,base_address FROM public.companies WHERE user_id = '${data[db_data]['user_id']}'`;
      const query_result_in_users = await db.one(detail_query_in_users);
      
      mappingData['id']  = query_result_in_users['id'];
      mappingData['companyName']  = query_result_in_users['name'];
      mappingData['companyAddress']  = query_result_in_users['base_address'];
      mappingData['title']  = '구인 공고';
      mappingData['companyImage'] = '';

      const detail_query_in_company_detail_company_welfares_type = `SELECT type FROM public.company_welfares WHERE company_id = '${query_result_in_users['id']}'`;  
      const query_result_in_company_detail_company_welfares_type = await db.any(detail_query_in_company_detail_company_welfares_type);

      for (const index in query_result_in_company_detail_company_welfares_type)
      {
        const detail_query_in_company_detail_company_welfares = `SELECT welfare_items FROM public.company_welfares WHERE company_id = '${query_result_in_users['id']}' AND type = '${query_result_in_company_detail_company_welfares_type[index]['type'].replace(/{|}/g, '')}'`;      
        const query_result_in_company_detail_company_welfares = await db.any(detail_query_in_company_detail_company_welfares);

        let count = 1;
        let detailwelfare = ''

        for (const index2 in query_result_in_company_detail_company_welfares[0]['welfare_items'])
        {
          if(count>1)
          {
            detailwelfare += ','+ query_result_in_company_detail_company_welfares[0]['welfare_items'][index2];
          }
          else
          {
            detailwelfare = query_result_in_company_detail_company_welfares[0]['welfare_items'][index2];
          }
          count +=1;
          
          console.log('');

        }
        mappingData['welfare_'+query_result_in_company_detail_company_welfares_type[index]['type'].replace(/{|}/g, '')] = mapDataString(detailwelfare);
        console.log('');
      }
      
      const detail_query_in_company_detail_job_descriptions = `SELECT job_type,desired_role,desired_experience,desired_working_date,night_shift,hiring_timing,employment_type,off_days FROM public.company_detail_job_descriptions WHERE company_id = '${query_result_in_users['id']}'`;
      const query_result_in_company_detail_job_descriptions = await db.any(detail_query_in_company_detail_job_descriptions);

      for (const index in query_result_in_company_detail_job_descriptions)
      {
        mappingData['offertype']  = mapDataString(query_result_in_company_detail_job_descriptions[index]['job_type']);
        mappingData['preferredTypes']  = mapDataString(query_result_in_company_detail_job_descriptions[index]['desired_role'].replace(/{|}/g, ''));
        mappingData['careerYears']  = mapDataString(query_result_in_company_detail_job_descriptions[index]['desired_experience'].replace(/{|}/g, ''));
        mappingData['workingDates'] = mapDataString(query_result_in_company_detail_job_descriptions[index]['desired_working_date'].replace(/{|}/g, ''));
        mappingData['nightShift']  = query_result_in_company_detail_job_descriptions[index]['night_shift'];
        mappingData['hiringTimeline'] = mapDataString(query_result_in_company_detail_job_descriptions[index]['hiring_timing'].replace(/{|}/g, ''));
        mappingData['jobState'] = mapDataString(query_result_in_company_detail_job_descriptions[index]['desired_role'].replace(/{|}/g, ''));
        mappingData['workStyleState'] = mapDataString(query_result_in_company_detail_job_descriptions[index]['employment_type'].replace(/{|}/g, ''));
        mappingData['offDaysState'] = mapDataString(query_result_in_company_detail_job_descriptions[index]['off_days'].replace(/{|}/g, ''));

        
      }

      await ES_Index.Index_Put_Data(indexName_company, mappingData);
      

      

      
      console.log('');
      
      
    
  }

  }

}




//////////////// user 필요항목 :
//id, -> id
//type, -> type
//job_type, -> job
//name, -> name
//birthday, -> birthDate
//sex, -> gender
//address, -> address
//phone,  -> phone
//email,  -> email
//profile_image, -> applicantImage

//users_licenses
//name -> licenses

//user_working_condition
//hope_addresses -> preferredLocation

//////////////////////////////////// company ///////////////////////

//// company
//id -> id
//name -> companyName: string;
//base_address > companyAddress: string;
// title > empty;

//// company_detail_job_descriptions
// job_type > offertype;
// preferredTypes > empty
// desired_experience > careerYears
// desired_working_date > workingDates
// night_shift > nightShift
// hiring_timing > hiringTimeline

//// company_images
// url > companyImage;

(async () => {
  const connection = await db.connect();

  const indexName_staff: string = 'staff_datas'; // 인덱스 이름 설정
  const indexName_hospital: string = 'hospital_datas'; // 인덱스 이름 설정
  const indexName_dentist: string = 'dentist_datas'; // 인덱스 이름 설정

  const tables = ['users', 'user_working_conditions', 'user_licenses', 'user_skills'];

  const person_mappingProperties: { [key: string]: { type: string } } = {
    id: { type: 'text' },
    type: { type: 'text' },
    job: { type: 'text' },
    name: { type: 'text' },
    birthDate: { type: 'text' },
    gender: { type: 'text' },
    address: { type: 'text' },
    phone: { type: 'text' },
    email: { type: 'text' },
    applicantImage: { type: 'text' },
    licenses: { type: 'text' },
    preferred_location: { type: 'text' },
  };

  const company_mappingProperties: { [key: string]: { type: string } } = {    
    id : { type: 'text' },
    companyName : { type: 'text' },
    companyAddress : { type: 'text' },
    companyImage : { type: 'text' },
    title : { type: 'text' },
    offerType : { type: 'text' },
    preferredTypes : { type: 'text' },
    careerYears : { type: 'text' },
    workingDates : { type: 'text' },
    nightShift : { type: 'text' },
    hiringTimeline : { type: 'text' },
    
    workStyleState : { type: 'text' },
    offDaysState : { type: 'text' },
    welfare_HOLIDAYS : { type: 'text' },
    welfare_REWARDS : { type: 'text' },
    welfare_FACILITIES : { type: 'text' },
    
  };

  // {
    // await ES_Index.Delete_Index(indexName_hospital);
  // }
  // {
  await ES_Index.Create_Index(indexName_staff, person_mappingProperties);
    await ES_Index.Create_Index(indexName_dentist, person_mappingProperties);
    await ES_Index.Create_Index(indexName_hospital, company_mappingProperties);
  // }

  {
    await ES_Index.Clear_Index(indexName_staff);
    await ES_Index.Clear_Index(indexName_dentist);
    await ES_Index.Clear_Index(indexName_hospital);

  }

  // const email = 'test' + String(101) + '@naver.com';
  
  
  console.log('');
  await PutStaffData(indexName_staff);
  await PutDentistData(indexName_dentist);
  await PutCompanyData(indexName_hospital);


  // match_all for table

  const all_result = await ES_Search.Search_All_Indexvalue(indexName_hospital);

  // console.log('');

  // // Single Field and Single Keyword
  const searchTerm: Record<string, string> = {
    'companyName': '바른이플란트치과의원',
  };
  const result2 = await ES_Search.Search_Singlekeyword_Singlefield_Match(indexName_hospital, searchTerm);

  console.log('');

  // // Multi Field and Multi Keyword
  // const searchFields1 = ["병원명","대표자명"]
  // const searchKeywords1 = ["바른오오플란트치과","김형석"]

  // const result3 = await ES_Search.Search_Any_Multikeyword_IN_Multifield(indexName,searchFields1,searchKeywords1);

  // // Should 다중 검색

  // const searchFields2 = ["병원명","대표자명","급여","담당 진료과목"]
  // const searchKeywords2 = ["바른오오플란트치과","김형석","월급","보철"]
  // const minimum_match_num = 3

  // const result4 = await ES_Search.Search_OR_Multikeyword_IN_Multifield(indexName,searchFields2,searchKeywords2,minimum_match_num);

  // // 하나의 Field에 다중 키워드 검색
  //
  // const searchFields3 = ["담당 진료과목"]
  // const searchKeywords3 = ["보철","임플란트"]
  // const minimum_match_num1 = 2

  // const result5 = await ES_Search.Search_OR_Multikeyword_IN_One_Field(indexName,searchFields3,searchKeywords3,minimum_match_num1);

  // // multi fiedl에 하나의 키워드 검색

  // const searchFields4 = ["병원명","대표자명","급여","담당 진료과목"]
  // const searchKeywords4 = "보철"
  // const result6 = await ES_Search.Search_Keyword_In_MultiFields(indexName,searchFields4,searchKeywords4)

  // AI Matching

  // const value = await Alg_Matching.Do_AI_Matching(result5,all_result);

  // certificate 예제
  // const input_data = {
  //   "name":"김형석",
  //   "type":"치과의사",
  //   "certi_num":"28599",
  //   "birth":"870905",
  // }

  // 사업자 예제
  // const input_data = {
  //   "business_number":"1657400332",
  // }

  // const value = await Alg_License.search_buiseness_license(input_data)
  // const result = value[input_data['name']]
  // output : {"이름" : "일치여부"} => {김형석 : 일치}

  console.log('');
})();
