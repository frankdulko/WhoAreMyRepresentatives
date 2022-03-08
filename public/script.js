var address = {
    "street1" : "",
    "street2" : "",
    "city" : "",
    "state" : "",
    "zip" : ""
}

var ocdID;

function getInput(form){
    address.street1 = form.street1.value;
    address.city = form.city.value;
    address.state = form.state.value;
    address.zip = form.zip.value;
    console.log(address);

    //window.location = "rep.html"
    document.getElementById("input").classList.add("d-none");
    document.getElementById("form-input").classList.add("d-none");
    document.getElementById("header-search").classList.remove("d-none");
    document.getElementById("main-content").removeChild(document.getElementById("result"));
    executeRepresentative()
  }



function loadClient() {
    gapi.client.setApiKey("AIzaSyA5-u0aJFuYGBGtP_FQz8xIL5Z7vqbAbkI");
    return gapi.client.load("https://civicinfo.googleapis.com/$discovery/rest?version=v2")
        .then(function() { console.log("GAPI client loaded for API"); execute()},
              function(err) { console.error("Error loading GAPI client for API", err); });
  }

  // Make sure the client is loaded before calling this method.
  function execute() {
    return gapi.client.civicinfo.elections.electionQuery({})
        .then(function(response) {
                // Handle the results here (response.result has the parsed body).
                console.log("Response", response);
                var electionDiv = document.getElementById("elections");
                response.result.elections.forEach(election => {
                  if (election.id == 2000){} else {
                    var name = document.createElement("div");
                    name.innerHTML = election.name
                    name.classList = "h4"
                    var electionDay = document.createElement("div")
                    electionDay.innerHTML = election.electionDay;
                    electionDay.classList = "h6"      

                    var electionItem = document.createElement("div");
                    electionItem.classList = "list-group-item"

                    electionItem.appendChild(name);
                    electionItem.appendChild(electionDay);

                    electionDiv.appendChild(electionItem);
                  }
                })
              },
              function(err) { console.error("Execute error", err); });
  }

  function executeVoter() {
    return gapi.client.civicinfo.elections.voterInfoQuery({
        //"address": address.street1 + " " + address.city + " " + address.state + " " + address.zip
      })
        .then(function(response) {
                // Handle the results here (response.result has the parsed body).
                console.log("Response", response);
              },
              function(err) { console.error("Execute error", err); });
  }

  function executeRepresentative() {
    return gapi.client.civicinfo.representatives.representativeInfoByAddress({
      "address": address.street1 + " " + address.city + " " + address.state + " " + address.zip
      //"address" : "205 Columbia Street Brooklyn NY 11231"
    })
        .then(function(response) {
                console.log(response)
                // Handle the results here (response.result has the parsed body).
                let subtitle = document.getElementById("address");
                subtitle.innerHTML = response.result.normalizedInput.line1 + ", " + response.result.normalizedInput.city + ", " + response.result.normalizedInput.state + " " + response.result.normalizedInput.zip;
                let resultDiv = document.createElement("div");
                resultDiv.className = "list-group"
                resultDiv.id = "result"
                document.getElementById("main-content").append(resultDiv);
                //resultDiv.className = "container";
                //console.log("Response", response);
                response.result.offices.forEach(office => {
                    office.officialIndices.forEach(index => {
                        var officialDiv = document.createElement("div");
                        officialDiv.classList = "list-group-item"
                        var position = document.createElement("div");
                        position.innerHTML = office.name;
                        position.classList = "h3"
                        var name = document.createElement("div");
                        name.innerHTML = response.result.officials[index].name
                        name.classList = "h5"
                        var party = document.createElement("div");
                        party.innerHTML = response.result.officials[index].party
                        party.classList = "h6"

                        officialDiv.append(position);
                        officialDiv.append(name);
                        officialDiv.append(party);

                        response.result.officials[index].phones.forEach(phone => {
                          var number = document.createElement("div");
                          number.innerHTML = phone
                          number.classList = "h6"
                          officialDiv.append(number)
                        })

                        response.result.officials[index].channels.forEach(channel => {
                          if (channel.type == "YouTube"){
                            var youtube = document.createElement("a");
                            youtube.href = "https://youtube.com/" + channel.id;
                            youtube.target = "_blank"
                            youtube.classList = "h3 px-2"
                            var icon = document.createElement("i");
                            icon.classList = "bi bi-youtube";
                            youtube.appendChild(icon)
                            officialDiv.append(youtube);
                          }
                          else if (channel.type == "Twitter"){
                            var youtube = document.createElement("a");
                            youtube.href = "https://twitter.com/" + channel.id;
                            youtube.classList = "h3 px-2"
                            youtube.target = "_blank"
                            var icon = document.createElement("i");
                            icon.classList = "bi bi-twitter";
                            youtube.appendChild(icon)
                            officialDiv.append(youtube);
                          }
                          else if (channel.type == "Facebook"){
                            var youtube = document.createElement("a");
                            youtube.href = "https://facebook.com/" + channel.id;
                            youtube.classList = "h3 px-2"
                            youtube.target = "_blank"
                            var icon = document.createElement("i");
                            icon.classList = "bi bi-facebook";
                            youtube.appendChild(icon)
                            officialDiv.append(youtube);
                          }
                        })
                        resultDiv.appendChild(officialDiv);
                    })
                });
              },
              function(err) { 
                console.error("Execute error", err);
                let subtitle = document.getElementById("address");
                subtitle.innerHTML = "Invalid Address"
              });
  }

  gapi.load("client");