rm "bin" -rf

mkdir "./bin"
mkdir "./bin/assets"
mkdir "./bin/node_modules"

cp assets/* "./bin/assets" -af
cp app.js "./bin/" -af
cp index.html "./bin/" -af
cp package.json "./bin/" -af

exclude=( "node_modules/gulp" "node_modules/rimraf" "node_modules/fs" "node_modules/benchmark" )

for D in node_modules/*; do
    if [[ -d "${D}" ]]; then
	
		for i in "${exclude[@]}"
		do
			if [ "$i" == "${D}" ] ; then
				continue 2
			fi
		done

		cp ${D} "./bin/node_modules" -af
    fi
done

cd "bin"
"C:\Program Files\7-Zip\7z.exe" a -r -t7z -mx9 "OpenMod.7z" .