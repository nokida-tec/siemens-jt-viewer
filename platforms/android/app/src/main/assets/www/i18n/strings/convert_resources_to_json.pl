#!/usr/bin/perl -w


use strict;
use Data::Dumper;
use XML::Simple;
use utf8::all;
binmode(STDIN, ':encoding(utf8)');
binmode(STDOUT, ':encoding(utf8)');
binmode(STDERR, ':encoding(utf8)');


my $fileout="Strings.json";
my $targetdir = '.';
my @excludedirs = qw(I18N);


my $header=<<"EOF";
{
EOF

my $foot=<<"EOF";
}
EOF

# the entrance
&main();

sub main{
	#find each resource file
	find_file($targetdir);
}


sub find_file{
    my $dir = shift;

    for my $item (@excludedirs){  
        return if($dir =~ m/$item$/i);
    }
    
    opendir(DIR,"$dir" || die "can't open this $dir");  
    my @files =readdir(DIR);
    closedir(DIR);  
    for my $file (@files){
        next if($file=~m/\.$/ || $file =~m/\.\.$/);
        if ($file =~/Resources\.resw$/i){
                print "process $dir\\$file \n"; 
                
				my $tag = $dir;
				$tag =~ s/.*\\(\w{2}-\w{2})$/$1/;
                parsefile($dir, $file, $tag);
        }
        elsif(-d "$dir\\$file"){
                find_file("$dir\\$file" );
        }
    }
}

sub parsefile{
	my ($dir, $file, $tag) = @_;
	
	my $content = formatxml("$dir\\$file");
	
	$fileout = $tag.".json";
	open (OUT, "> $targetdir\\$fileout") || die ("Could not open file: $dir\\$fileout : $!");
	print OUT $header, $content, $foot;
	
	close(OUT) or die "can't close $fileout: $!";
}


sub formatxml{
	my ($file) = @_;
	my $xml = XMLin($file);
	my $content;
	while(my ($key, $value) = each %{$xml->{'data'}}){
		$value->{value} =~ s/"//g;
		$content .= "	\"$key\" : \"$value->{value}\",\n";
	}
	$content =~ s/,\n$/\n/;
	return $content;
}