DIR="~/bm_iot_keep_alive"

rm -rf DIR;
mkdir DIR
git clone "https://git.ng.bluemix.net/andcbrant/drew-iot-new.git" DIR
date > DIR/date.txt
git add .
git commit -m "keep alive"
git push
rm -rf DIR