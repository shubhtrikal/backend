const express = require("express");
const router = express.Router();
const User = require("../models/UserModel");
const Request = require("../models/RequestModel");


router.get('/getRequests', async(req, res) => {
    const requests = await Request.find()
    // console.log(requests)
    return res.status(200).json(requests)
})

// router.get('/getRequestUser', async(req, res) => {
//     const requests = await Request.find()
//     // console.log(requests)
//     let reqs = await Request.find();
//      console.log(reqs)
//     let user = await User.find();
//     // console.log(user)
//     for(let i=0;i<requests.length;i++){
//         for(let j=0;j<user.length;j++){
//             // console.log(requests[i].user)
//             // console.log(user[j]._id)
//             if(requests[i].user.toString() === user[j]._id.toString()){
//                 console.log(user[j].name)
//                 reqs[i].name = user[j].name
//                 break;
//             }
//         }
//     }
//     console.log(reqs)
//     return res.status(200).json(reqs)
// })
router.post("/getRequest", async (req, res) => {
  try {
    const request = await Request.findOne({ _id: req.body._id });
    if (request) {
      return res.status(200).json(request);
    } else return res.status(400).json("User not found");
  } catch (err) {
    return res.status(400).json(err);
  }
});


router.post('/addRequest', async(req, res) => {
    const data = req.body
    // console.log(data)
    const user = await User.findOne({ email : data.email})
    if(user) {
        const request = new Request({
            message : data.message,
            photoUrl : data.photoUrl,
            user : user._id,
            latitude : data.latitude,
            longitude : data.longitude,
            status : 'pending',
            wasteType : data.wasteType,
        })
        await request.save()
                    .then((request) => {
                        user.requests.push(request._id)
                        if(data.wasteType === 'recyclable')
                          user.credit = user.credit + 1
                        user.save()
                        return request;
                        
                    })
                    .then((request) => {
                        return res.status(200).json(request)
                    })
                    .catch((err) => {
                        console.log(err)
                        return res.status(500).json(err)
                    })
    }
    else {
        console.log('User does not exist');
        return res.status(400).json({ error : 'User does not exist'})
    }
})

router.post('/acceptRequest', async(req, res) => {
    const data = req.body
    const user = await User.findOne({ email : data.email})
    // console.log(user)
    if(user && user.role === 'collector' && user.status === 'verified') {
        const request = await Request.findOne({ _id : data.requestId})
        let req = await Request.find();
        if(request) {
            if(request.status === 'accepted') {
                // console.log("already accepted");
                return res.status(200).json(req);
            }
            request.status = 'accepted'
            request.collector = user._id
            user.requests.push(request._id);
            await user.save()
                .then((user) => {
                    // console.log(user)
                })
                .catch((err) => {
                    console.log(err)
                })
            request.approveTime = data.approveTime
            await request.save()
                        .then((request) => {
                            for(let i=0;i<req.length;i++){
                                if(req[i].collector === request._id){
                                    req[i].status = 'accepted'
                                }
                            }
                            return req;
                        })
                        .then((req) => {
                            return res.status(200).json(req)
                        })
                        .catch((err) => {
                            console.log(err)
                            return res.status(500).json(err)
                        })
        }
        else {
            return res.status(400).json({ error : 'Request does not exist'})
        }
    }
   else {
    return res
      .status(400)
      .json({ error: "User does not exist or is not a verified collector" });
  }
});

router.post("/completeRequest", async (req, res) => {
  const data = req.body;
  const user = await User.findOne({ email: data.email });
  let reqs = await Request.find();
  if (user && user.role === "collector" && user.status === "verified") {
    const request = await Request.findOne({ _id: data.requestId });
    if (request) {
      request.status = "completed";
      await request
        .save()
        .then((request) => {
          for (let i = 0; i < reqs.length; i++) {
            if (reqs[i].collector === request._id) {
              reqs[i].status = "completed";
            }
          }
          return reqs;
        })
        .then((reqs) => {
          return res.status(200).json(reqs);
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).json(err);
        });
    } else {
      return res.status(400).json({ error: "Request does not exist" });
    }
  } else {
    return res
      .status(400)
      .json({ error: "User does not exist or is not a verified collector" });
  }
});

router.post('/getCredit', async(req, res) => {
    const data = req.body
    const user = await User.findOne({ email : data.email})
    if(user) {
        return res.status(200).json({ credit : user.credit})
    }
    else {
        return res.status(400).json({ error : 'User does not exist'})
    }
})

router.post('/setScore', async(req, res) => {
    const data = req.body
    const user = await User.findOne({ email : data.email})
    if(user) {
        user.score = data.score
        await user.save()
                    .then((user) => {
                        return res.status(200).json(user)
                    })
                    .catch((err) => {
                        console.log(err)
                        return res.status(500).json(err)
                    })
    }
    else {
        return res.status(400).json({ error : 'User does not exist'})
    }
})

module.exports = router
