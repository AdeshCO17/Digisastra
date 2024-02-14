const {PrismaClient}=require("@prisma/client")

const database=new PrismaClient();

async function main(){

    try {
        await database.category.createMany({
            data:[
                {name:"computer science"},
                {name:"Music"},
                {name:"Fitness"},
                {name:"Photograpy"},
                {name:"Accounting"},
                {name:"Engineering"},
                {name:"Filming"},
            ]
        });
        console.log("success")
    } catch (error) {
        console.log("Error seeding the database category",error);
    }
    finally{

       await database.$disconnect();
    }
}
main();