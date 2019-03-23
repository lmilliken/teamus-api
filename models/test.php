function calcWeeksPay($type) 
{
$a=53.64;
$p=69.34;

if($type==1)
{
if($hours>40)
{
$e=$hour-40;
$pay=(40*$a)+($e*(2*$a));
}
else 
{
$pay=$hour*$a;
}
}
else
{
if($hours>40)
{
$e=$hour-40;
$pay=(40*$p)+($e*(2*$p));

}
else 
{
$pay=$hour*$p;
}
}
}