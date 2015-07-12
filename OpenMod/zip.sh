rm "C:/electron x32/resources/app/" -rf

mkdir "C:/electron x32/resources/app"
mkdir "C:/electron x32/resources/app/assets"
mkdir "C:/electron x32/resources/app/node_modules"

cp assets/* "C:/electron x32/resources/app/assets" -af
cp app.js "C:/electron x32/resources/app/" -af
cp index.html "C:/electron x32/resources/app/" -af
cp package.json "C:/electron x32/resources/app/" -af

exclude=( "node_modules/gulp" "node_modules/rimraf" "node_modules/fs" "node_modules/benchmark" )

for D in node_modules/*; do
    if [[ -d "${D}" ]]; then
	
		match=0
		for i in "${exclude[@]}"
		do
			if [ "$i" == "${D}" ] ; then
				match=1
				break
			fi
		done

		if [[ $match = 0 ]] ; then
			cp ${D} "C:/electron x32/resources/app/node_modules" -af			
		fi
    fi
done

# rm "OpenMod x32.7z"
# "C:\Program Files\7-Zip\7z.exe" a -r -t7z -mx9 "OpenMod x32.7z" ./


rm "C:/electron x64/resources/app/" -rf

mkdir "C:/electron x64/resources/app"
mkdir "C:/electron x64/resources/app/assets"
mkdir "C:/electron x64/resources/app/node_modules"

cp assets/* "C:/electron x64/resources/app/assets" -af
cp app.js "C:/electron x64/resources/app/" -af
cp index.html "C:/electron x64/resources/app/" -af
cp package.json "C:/electron x64/resources/app/" -af

exclude=( "node_modules/gulp" "node_modules/rimraf" "node_modules/fs" "node_modules/benchmark" )

for D in node_modules/*; do
    if [[ -d "${D}" ]]; then
	
		match=0
		for i in "${exclude[@]}"
		do
			if [ "$i" == "${D}" ] ; then
				match=1
				break
			fi
		done

		if [[ $match = 0 ]] ; then
			cp ${D} "C:/electron x64/resources/app/node_modules" -af			
		fi
    fi
done

# rm "OpenMod x64.7z"
# "C:\Program Files\7-Zip\7z.exe" a -r -t7z -mx9 "OpenMod x64.7z" ./